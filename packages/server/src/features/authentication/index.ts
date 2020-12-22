import { createCognitoProvider } from '../../providers/cognito';
import {
  createAuthenticationService,
  AuthenticationService,
} from './services/authentication';
import { authenticationMiddleware } from './middlewares/authentication';
import { createApp, BASE_PATH, DESCRIPTION } from './apps/authentication';

export type AuthenticationFeatureOptions = {
  readonly region: string;
  readonly userPoolId: string;
  readonly appClientId: string;
  readonly appClientSecret: string;
};

type AuthenticationFeatureInputs = {
  authenticationService: AuthenticationService;
};

const authenticationFeature = ({
  authenticationService,
}: AuthenticationFeatureInputs) => ({
  authenticationBasePath: BASE_PATH,
  authenticationDescription: DESCRIPTION,

  authenticationMiddleware() {
    return authenticationMiddleware({ authenticationService });
  },

  authenticationApp() {
    return createApp({ authenticationService });
  },
});

type AuthenticationFeature = ReturnType<typeof authenticationFeature>;

export const createAuthenticationFeature = async ({
  region,
  userPoolId,
  appClientId,
  appClientSecret,
}: AuthenticationFeatureOptions): Promise<AuthenticationFeature> => {
  const cognitoService = await createCognitoProvider({
    region,
    userPoolId,
    appClientId,
    appClientSecret,
  });

  const authenticationService = createAuthenticationService({ cognitoService });

  return authenticationFeature({ authenticationService });
};
