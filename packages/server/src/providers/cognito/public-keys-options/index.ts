import { createCognitoPublicKeysUrl } from './cognito-public-keys-url';
import { createVirtualCognitoPublicKeysUrl } from './virtual-cognito-public-keys-url';
import { fetchCognitoPublicKeys } from './cognito';
import { fetchVirtualCognitoPublicKeys } from './virtual-cognito';

export type FetchPublicKeyInput = {
  url: string;
};

export type FetchPublicKeyResult = {
  [key: string]: string;
};

export type PublicKeyOptions = {
  readonly url: string;
  readonly fetchPublicKeys: FetchPublicKeys;
};

type CreatePublicKeysOptionsInput = {
  readonly region: string;
  readonly userPoolId: string;
};

type FetchPublicKeys = (
  fetchPublicKeyInput: FetchPublicKeyInput
) => Promise<FetchPublicKeyResult>;

const createVirtualCognitoOptions = ({ userPoolId }): PublicKeyOptions => {
  return {
    url: createVirtualCognitoPublicKeysUrl({ userPoolId }),
    fetchPublicKeys: fetchVirtualCognitoPublicKeys,
  };
};

const createCognitoOptions = ({ region, userPoolId }): PublicKeyOptions => {
  return {
    url: createCognitoPublicKeysUrl({ region, userPoolId }),
    fetchPublicKeys: fetchCognitoPublicKeys,
  };
};

export const createPublicKeysOptions = ({
  region,
  userPoolId,
}: CreatePublicKeysOptionsInput): PublicKeyOptions => {
  if (region === `localhost`)
    return createVirtualCognitoOptions({ userPoolId });

  return createCognitoOptions({ region, userPoolId });
};
