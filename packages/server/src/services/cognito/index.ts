import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { createTokenValidator } from './token-validator';
import { Awaited } from '../../helpers/types/awaited';

type CreateCognitoServiceInput = {
  userPoolId: string;
  appClientId: string;
  appClientSecret: string;
  region: string;
};
export type CognitoOptions = CreateCognitoServiceInput;

export const createCognitoService = async ({
  region,
  userPoolId,
  appClientId,
  appClientSecret,
}: CreateCognitoServiceInput) => {
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

export type CognitoService = Awaited<typeof createCognitoService>;
