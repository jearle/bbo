import * as express from 'express';
import * as fetch from 'node-fetch';

import { authenticationMiddleware as createAuthenticationMiddleware } from '.';

import {
  fetchTextOnRandomPort,
  fetchJSONOnRandomPort,
} from '../../helpers/express/listen-fetch';

import { createCognitoService, CognitoService } from '../../services/cognito';

const {
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

const EXPIRED_TOKEN = `eyJraWQiOiJaeWxiRk1FNml2dmxUa2JmcUJtV0paeTYxN1IxTm82bG1vQXREa24reVdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMjc5MTg2YS0wZGQ4LTQ3NjUtYmU5Ny0zYzJlMWZjMTE1YWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzM3Mjk5ZjI2LTAzOGQtNGJiNC1iMzBkLWE5ZTAzOTMwMjcxMSIsImV2ZW50X2lkIjoiNmUwZjNlNDAtMjcxMy00NGI1LTk4ZjItZWZhMTU5OTk5ZGY5IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTYwNTE5NDgwNCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfUnBNTmZobEZnIiwiZXhwIjoxNjA1MTk4NDA0LCJpYXQiOjE2MDUxOTQ4MDUsImp0aSI6IjlkN2I3OGE0LTRhMmYtNDliMS1iY2U1LWFkYzA4OWQ0YjU5YSIsImNsaWVudF9pZCI6Im11bXRjYjVhbnJubGVtaW9ucHFlanFmNGgiLCJ1c2VybmFtZSI6ImplYXJsZUByY2FuYWx5dGljcy5jb20ifQ.BBpDtsJAnUdxBtzxw7IfmAFXZQeY3VQmhUo434mLMb-cGvPOYTJMDyjmi_Fd3oz0PSvfQzQp1X4CxD75dCvxLEBHlX4uMop9W2KOrQxjB0mbZLaaIzt8gDvsTvVD5_VTCnNMtz_B8FHxhWLxGAxiSpX8GsyarpczN8aQnT2jkxYkgr1tXfSZfVGyoxe4bXZ44KMeYndi8tJ44bUcTzeUC_UDmRR5zleFIvlYtjOwmY4JOADN27zlG45IoIDH-3mJktXFr61HG3gGdMLBu-rSsxz8jjT7wGzqX_wVYehD82uIANCsu6lZw9yTtH_YBRopG1aWHtmg6IG8XDqSMp1ARw`;

describe(`authenticationMiddleware`, () => {
  let cognitoService: CognitoService;
  let authenticationMiddleware;
  let app;

  beforeAll(async () => {
    cognitoService = await createCognitoService({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });

    authenticationMiddleware = createAuthenticationMiddleware({
      authenticationService: cognitoService,
    });
  });

  beforeEach(() => {
    app = express();
  });

  test(`valid token`, async () => {
    app.use(async (req, res, next) => {
      const { accessToken } = await cognitoService.authenticateUser({
        username: `user-for-tests`,
        password: `=Z9-xW%7`,
      });
      req.headers[`accesstoken`] = accessToken;
      next();
    });
    app.use(authenticationMiddleware);
    app.get(`/`, (req, res) => {
      res.send(`pass`);
    });

    const text = await fetchTextOnRandomPort(app);

    expect(text).toBe(`pass`);
  });

  test(`no token`, async () => {
    app.use(authenticationMiddleware);
    app.get(`/`, (req, res) => {
      res.send(`pass`);
    });

    const {
      data: { error },
    } = await fetchJSONOnRandomPort(app);

    expect(error).toMatch(/invalid/i);
  });

  test(`invalid token from auth service`, async () => {
    app.use(async (req, res, next) => {
      req.headers[`accesstoken`] = EXPIRED_TOKEN;
      next();
    });
    app.use(authenticationMiddleware);
    app.get(`/`, (req, res) => {
      res.send(`pass`);
    });

    const {
      data: { error },
    } = await fetchJSONOnRandomPort(app);

    expect(error).toMatch(/expired/);
  });
});
