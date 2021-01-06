const { VIRTUAL_COGNITO_URL } = process.env;

type CreateCognitoPublicKeysUrlInput = {
  userPoolId: string;
};

export const createVirtualCognitoPublicKeysUrl = ({
  userPoolId,
}: CreateCognitoPublicKeysUrlInput): string => {
  return `${VIRTUAL_COGNITO_URL}/public-keys/${userPoolId}`;
};
