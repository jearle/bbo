import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Awaited } from 'shared/dist/helpers/types/awaited';

import { createCognitoPemsURL } from './cognito-pems-url';
import { createTokenValidator, TokenValidator } from './token-validator';
import { fetchPems } from './fetch-pems';
import { fetchPublicKeys as fetchPublicKeysOriginal } from './fetch-public-keys';

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

const getPublicKeysUrl = ({
  region,
  userPoolId,
}: {
  region: string;
  userPoolId: string;
}): string => {
  return COGNITO_PEM_URL_OVERRIDE
    ? COGNITO_PEM_URL_OVERRIDE
    : createCognitoPemsURL({
        region,
        userPoolId,
      });
};

export const createCognitoProvider = async ({
  region,
  userPoolId,
  appClientId,
  appClientSecret,
}: CreateCognitoServiceInput): Promise<CreateCognitoServiceResult> => {
  const cognitoIdentity = new CognitoIdentityServiceProvider({
    region,
    endpoint: `http://127.0.0.1:49000`,
  });

  const publicKeysUrl = getPublicKeysUrl({ region, userPoolId });

  const fetchPublicKeys = COGNITO_PEM_URL_OVERRIDE
    ? () => {
        const publicKeys = fetchPublicKeysOriginal({ url: publicKeysUrl });

        return publicKeys;
      }
    : () => {
        const publicKeys = fetchPems({
          url: publicKeysUrl,
        });

        return publicKeys;
      };

  const tokenValidator = await createTokenValidator({
    publicKeysUrl,
    fetchPublicKeys,
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
