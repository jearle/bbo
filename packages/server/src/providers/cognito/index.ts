import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { createTokenValidator, TokenValidator } from './token-validator';
import { createPublicKeys } from './public-keys';
import { createPublicKeysOptions } from './public-keys-options';

type CreateCognitoServiceInput = {
  readonly userPoolId: string;
  readonly appClientId: string;
  readonly appClientSecret: string;
  readonly region: string;
};
export type CognitoOptions = CreateCognitoServiceInput;

type CreateCognitoServiceResult = {
  readonly appClientId: string;
  readonly appClientSecret: string;
  readonly cognitoIdentity: CognitoIdentityServiceProvider;
  readonly tokenValidator: TokenValidator;
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

  const publicKeysOptions = createPublicKeysOptions({ region, userPoolId });
  const publicKeys = createPublicKeys(publicKeysOptions);

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
