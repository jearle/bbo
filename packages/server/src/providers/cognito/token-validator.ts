import { promisify } from 'util';
import { decode, verify as verifyCallback } from 'jsonwebtoken';

const verify = promisify(verifyCallback);

type PublicKeys = { [key: string]: string };
type FetchPublicKeys = () => Promise<PublicKeys>;

type CreateTokenValidatorInput = {
  publicKeysUrl: string;
  fetchPublicKeys: FetchPublicKeys;
  tokenUse: string;
  maxAge: number;
};

type ValidateInput = {
  token: string;
};

type ValidateResult = {
  username: string;
  [key: string]: null | boolean | number | string;
};

type TokenValidatorInput = {
  publicKeysUrl: string;
  publicKeys: PublicKeys;
  tokenUse: string;
  maxAge: number;
};

const checkDecodedJwt = (decodeJwt: string) => {
  if (!decodeJwt) throw new TypeError(`Invalid JWT Token`);
};

const checkIssuer = (url: string, issuer: string) => {
  if (!url.includes(issuer))
    throw new TypeError(`URL does not match JWT issuer`);
};

const checkTokenUse = (configuredTokenUse: string, actualTokenUse: string) => {
  if (configuredTokenUse !== actualTokenUse)
    throw new TypeError(
      `Configured token use '${configuredTokenUse}' does not match actual token use '${actualTokenUse}'`
    );
};

const checkPem = (pem) => {
  if (!pem) throw new TypeError(`No pem found for provided kid, invalid token`);
};

const tokenValidator = ({
  publicKeysUrl,
  publicKeys,
  tokenUse,
  maxAge,
}: TokenValidatorInput) => ({
  async validate({ token }: ValidateInput): Promise<ValidateResult> {
    const decodedJwt = decode(token, { complete: true });
    checkDecodedJwt(decodedJwt);

    const { iss, token_use: actualTokenUse } = decodedJwt.payload;
    checkIssuer(publicKeysUrl, iss);
    checkTokenUse(tokenUse, actualTokenUse);

    const { kid: keyId } = decodedJwt.header;

    const pem = publicKeys[keyId];

    checkPem(pem);

    const body = await verify(token, pem, {
      issuer: iss,
      maxAge,
    });

    return body;
  },
});

export type TokenValidator = ReturnType<typeof tokenValidator>;

const createConfigTypeError = (name, value) =>
  new TypeError(`${name} must be specified, received '${value}'`);

const checkTokenUseConfig = (tokenUse: string) => {
  if (!tokenUse || !tokenUse.trim())
    throw createConfigTypeError(`tokenUse`, tokenUse);
};

const checkMaxAge = (maxAge: number) => {
  if (!maxAge) throw createConfigTypeError(`maxAge`, maxAge);
};

export const createTokenValidator = async ({
  publicKeysUrl,
  fetchPublicKeys,
  tokenUse,
  maxAge,
}: CreateTokenValidatorInput): Promise<TokenValidator> => {
  checkTokenUseConfig(tokenUse);
  checkMaxAge(maxAge);

  const publicKeys = await fetchPublicKeys();

  return tokenValidator({ publicKeysUrl, publicKeys, tokenUse, maxAge });
};
