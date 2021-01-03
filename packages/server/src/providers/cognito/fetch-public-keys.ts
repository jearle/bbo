import fetch from 'node-fetch';

type FetchPublicKeyInput = {
  url: string;
};

type FetchPublicKeyResult = {
  [key: string]: string;
};

export const fetchPublicKeys = async ({
  url,
}: FetchPublicKeyInput): Promise<FetchPublicKeyResult> => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};
