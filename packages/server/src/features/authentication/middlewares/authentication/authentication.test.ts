import * as express from 'express';

import {
  fetchTextOnRandomPort,
  fetchJSONOnRandomPort,
} from 'shared/dist/helpers/express/listen-fetch';

import { authenticationMiddleware as createAuthenticationMiddleware } from '.';

import { createAuthenticationService } from '../../services/authentication';
import { createCognitoProvider } from '../../../../providers/cognito';
import {
  CREDENTIALS,
  LOCALHOST_COGNITO_CONFIG,
} from '../../../../providers/cognito/helpers/test/data';

const createTestAuthentication = async ({
  appClientId = LOCALHOST_COGNITO_CONFIG.appClientId,
} = {}) => {
  const cognitoProvider = await createCognitoProvider({
    ...LOCALHOST_COGNITO_CONFIG,
    appClientId,
  });
  const authenticationService = await createAuthenticationService({
    cognitoService: cognitoProvider,
  });
  const authenticationMiddleware = await createAuthenticationMiddleware({
    authenticationService,
  });

  return {
    cognitoProvider,
    authenticationService,
    authenticationMiddleware,
  };
};

const getAuthenticatedUserAccessToken = async ({
  appClientId = undefined,
} = {}) => {
  const { authenticationService } = await createTestAuthentication({
    appClientId,
  });
  const { accessToken } = await authenticationService.authenticateUser({
    username: CREDENTIALS.username,
    password: CREDENTIALS.password,
  });
  return accessToken;
};

const createApp = async ({ accessToken }) => {
  const { authenticationMiddleware } = await createTestAuthentication();

  const app = express();
  app.use(async (req, res, next) => {
    req.headers[`accesstoken`] = accessToken;
    next();
  });
  app.use(authenticationMiddleware);
  app.get(`/`, (req, res) => {
    res.send(`pass`);
  });

  return app;
};

describe(`authenticationMiddleware`, () => {
  test(`authenticationMiddleware`, async () => {
    const accessToken = await getAuthenticatedUserAccessToken();
    const app = await createApp({ accessToken });
    const text = await fetchTextOnRandomPort(app);

    expect(text).toBe(`pass`);
  });

  test(`authenticationMiddleware no token`, async () => {
    const app = await createApp({ accessToken: undefined });
    const { status } = await fetchJSONOnRandomPort(app);

    expect(status).toBe(401);
  });

  test(`authenticationMiddleware expired`, async () => {
    const accessToken = await getAuthenticatedUserAccessToken({
      appClientId: `expired`,
    });
    const app = await createApp({ accessToken });
    const { status } = await fetchJSONOnRandomPort(app);

    expect(status).toBe(401);
  });
});
