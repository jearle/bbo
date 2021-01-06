type CreateCognitoUrlInput = {
  region: string;
  userPoolId: string;
};

const createConfigTypeError = (name, value) =>
  new TypeError(`${name} must be specified, received '${value}'`);

const checkRegion = (region: string) => {
  if (!region || !region.trim()) throw createConfigTypeError(`region`, region);
};

const checkUserPoolId = (userPoolId: string) => {
  if (!userPoolId || !userPoolId.trim())
    throw createConfigTypeError(`userPoolId`, userPoolId);
};

export const createCognitoPemsURL = ({
  region,
  userPoolId,
}: CreateCognitoUrlInput): string => {
  checkRegion(region);
  checkUserPoolId(userPoolId);

  return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
};
