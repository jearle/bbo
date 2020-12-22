import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { createTokenValidator, TokenValidator } from './token-validator';
import { Awaited } from '../../helpers/types/awaited';

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

export const createCognitoProvider = async ({
  region,
  userPoolId,
  appClientId,
  appClientSecret,
}: CreateCognitoServiceInput): Promise<CreateCognitoServiceResult> => {
  const cognitoIdentity = new CognitoIdentityServiceProvider({
    region,
  });

  const tokenValidator = await createTokenValidator({
    region,
    userPoolId,
    tokenUse: `access`,
    maxAge: 3600,
  });

  return {
    appClientId,
    appClientSecret,
    cognitoIdentity,
    tokenValidator,
  };
};

export type CognitoProvider = Awaited<typeof createCognitoProvider>;
