import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { createCognitoPemsURL } from './cognito-pems-url';
import { createTokenValidator, TokenValidator } from './token-validator';
import { Awaited } from 'shared/dist/helpers/types/awaited';

const { COGNITO_PEM_URL_OVERRIDE } = process.env;

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

  const pemsUrl = COGNITO_PEM_URL_OVERRIDE
    ? COGNITO_PEM_URL_OVERRIDE
    : createCognitoPemsURL({
        region,
        userPoolId,
      });

  const tokenValidator = await createTokenValidator({
    pemsUrl,
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
