import { PublicKeyOptions } from '../public-keys-options';

type Header = {
  readonly kid: string;
};

type Payload = {
  readonly iss: string;
  readonly token_use: string;
};

type FetchInput = {
  readonly header: Header;
  readonly payload: Payload;
};

const checkIssuer = (url: string, issuer: string) => {
  const localhostRegexp = /127.0.0.1/;

  if (
    !url
      .replace(localhostRegexp, `localhost`)
      .includes(issuer.replace(localhostRegexp, `localhost`))
  )
    throw new TypeError(`URL does not match JWT issuer`);
};

const checkTokenUse = (tokenUse: string) => {
  if (tokenUse !== `access`)
    throw new TypeError(
      `Configured token use '${tokenUse}' does not match actual token use "access"`
    );
};

const checkPublicKey = (publicKey) => {
  if (!publicKey)
    throw new TypeError(
      `No publicKey found for provided kid (key id), invalid token`
    );
};

const publicKeys = ({ url, fetchPublicKeys }) => ({
  async fetchPublicKey({ header, payload }: FetchInput) {
    const { kid: keyId } = header;
    const { iss: issuer, token_use: tokenUse } = payload;

    checkIssuer(url, issuer);
    checkTokenUse(tokenUse);

    const publicKeys = await fetchPublicKeys({ url });

    const publicKey = publicKeys[keyId];

    checkPublicKey(publicKey);

    return publicKey;
  },
});

export type PublicKeys = ReturnType<typeof publicKeys>;

export const createPublicKeys = (
  publicKeyOptions: PublicKeyOptions
): PublicKeys => {
  return publicKeys(publicKeyOptions);
};
