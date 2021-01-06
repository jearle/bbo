type CreateCognitoPublicKeysUrlInput = {
  region: string;
  userPoolId: string;
};

export const createCognitoPublicKeysUrl = ({
  region,
  userPoolId,
}: CreateCognitoPublicKeysUrlInput): string => {
  return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
};
