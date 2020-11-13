import { promisify } from 'util';
import { Request, Response } from 'express';
import * as jwkToPem from 'jwk-to-pem';
import { decode, verify as verifyCallback } from 'jsonwebtoken';
import fetch from 'node-fetch';

const verify = promisify(verifyCallback);

type CreateCognitoUrlInput = {
  region: string;
  userPoolId: string;
};

type CreateTokenValidatorInput = {
  region: string;
  userPoolId: string;
  tokenUse: string;
  maxAge: number;
};

type FetchPemsInput = {
  url: string;
};

type FetchPemsResult = {
  [key: string]: string;
};

type ValidateInput = {
  token: string;
};

type ValidateResult = {
  username: string;
  [key: string]: any;
};

type TokenValidatorInput = {
  url: string;
  pems: FetchPemsResult;
  tokenUse: string;
  maxAge: number;
};

const createCognitoURL = ({
  region,
  userPoolId,
}: CreateCognitoUrlInput): string =>
  `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

const fetchPems = async ({ url }: FetchPemsInput): Promise<FetchPemsResult> => {
  const response = await fetch(url);
  const { keys } = await response.json();

  const pems = keys.reduce((acc, key) => {
    const { kid: keyId, n: modulus, e: exponent, kty: keyType } = key;
    const jwk = { kty: keyType, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);

    return { ...acc, [keyId]: pem };
  }, {});

  return pems;
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
  url,
  pems,
  tokenUse,
  maxAge,
}: TokenValidatorInput) => ({
  async validate({ token }: ValidateInput): Promise<ValidateResult> {
    const decodedJwt = decode(token, { complete: true });
    checkDecodedJwt(decodedJwt);

    const { iss, token_use: actualTokenUse } = decodedJwt.payload;
    checkIssuer(url, iss);
    checkTokenUse(tokenUse, actualTokenUse);

    const { kid: keyId } = decodedJwt.header;
    const pem = pems[keyId];
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

const checkRegion = (region: string) => {
  if (!region || !region.trim()) throw createConfigTypeError(`region`, region);
};

const checkUserPoolId = (userPoolId: string) => {
  if (!userPoolId || !userPoolId.trim())
    throw createConfigTypeError(`userPoolId`, userPoolId);
};

const checkTokenUseConfig = (tokenUse: string) => {
  if (!tokenUse || !tokenUse.trim())
    throw createConfigTypeError(`tokenUse`, tokenUse);
};

const checkMaxAge = (maxAge: number) => {
  if (!maxAge) throw createConfigTypeError(`maxAge`, maxAge);
};

export const createTokenValidator = async ({
  region,
  userPoolId,
  tokenUse,
  maxAge,
}: CreateTokenValidatorInput) => {
  checkRegion(region);
  checkUserPoolId(userPoolId);
  checkTokenUseConfig(tokenUse);
  checkMaxAge(maxAge);

  const url = createCognitoURL({ region, userPoolId });
  const pems = await fetchPems({ url });

  return tokenValidator({ url, pems, tokenUse, maxAge });
};
