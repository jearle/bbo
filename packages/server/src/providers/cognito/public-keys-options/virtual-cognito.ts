import fetch from 'node-fetch';

import { FetchPublicKeyInput, FetchPublicKeyResult } from '.';

export const fetchVirtualCognitoPublicKeys = async ({
  url,
}: FetchPublicKeyInput): Promise<FetchPublicKeyResult> => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};
