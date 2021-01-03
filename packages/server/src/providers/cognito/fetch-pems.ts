import fetch from 'node-fetch';
import * as jwkToPem from 'jwk-to-pem';

type FetchPemsInput = {
  url: string;
};

type FetchPemsResult = {
  [key: string]: string;
};

export const fetchPems = async ({
  url,
}: FetchPemsInput): Promise<FetchPemsResult> => {
  const response = await fetch(url);
  const json = await response.json();

  const { keys } = json;

  const pems = keys.reduce((acc, key) => {
    const { kid: keyId, n: modulus, e: exponent, kty: keyType } = key;
    const jwk = { kty: keyType, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);

    return { ...acc, [keyId]: pem };
  }, {});

  return pems;
};
