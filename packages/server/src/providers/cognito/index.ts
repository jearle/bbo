import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { createTokenValidator, TokenValidator } from './token-validator';

import { createPublicKeys } from './public-keys';

type CreateCognitoServiceInput = {
  userPoolId: string;
  appClientId: string;
  appClientSecret: string;
  region: string;
};
export type CognitoOptions = CreateCognitoServiceInput;

type CreateCognitoServiceResult = {
  appClientId: string;
  appClientSecret: string;
  cognitoIdentity: CognitoIdentityServiceProvider;
  tokenValidator: TokenValidator;
};

export const createCognitoProvider = ({
  region,
  userPoolId,
  appClientId,
  appClientSecret,
}: CreateCognitoServiceInput): CreateCognitoServiceResult => {
  const endpoint =
    region === `localhost` ? { endpoint: process.env.VIRTUAL_COGNITO_URL } : {};

  const cognitoIdentity = new CognitoIdentityServiceProvider({
    region,
    ...endpoint,
  });

  const publicKeys = createPublicKeys({ region, userPoolId });

  const tokenValidator = createTokenValidator({
    publicKeys,
  });

  return {
    appClientId,
    appClientSecret,
    cognitoIdentity,
    tokenValidator,
  };
};

export type CognitoProvider = ReturnType<typeof createCognitoProvider>;
