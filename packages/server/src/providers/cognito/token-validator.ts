import { promisify } from 'util';
import { decode, verify as verifyCallback } from 'jsonwebtoken';
import { PublicKeys } from './public-keys';

const verify = promisify(verifyCallback);

type CreateTokenValidatorInput = {
  publicKeys: PublicKeys;
};

type ValidateInput = {
  token: string;
};

type ValidateResult = {
  username: string;
  [key: string]: null | boolean | number | string;
};

type TokenValidatorInput = {
  publicKeys: PublicKeys;
};

const tokenValidator = ({ publicKeys }: TokenValidatorInput) => ({
  async validate({ token }: ValidateInput): Promise<ValidateResult> {
    const decodedJwt = decode(token, { complete: true });
    const { iss: issuer } = decodedJwt.payload;

    const publicKey = await publicKeys.fetchPublicKey(decodedJwt);

    const body = await verify(token, publicKey, {
      issuer,
      maxAge: 3600,
    });

    return body;
  },
});

export type TokenValidator = ReturnType<typeof tokenValidator>;

export const createTokenValidator = ({
  publicKeys,
}: CreateTokenValidatorInput): TokenValidator => {
  return tokenValidator({
    publicKeys,
  });
};
