import fetch from 'node-fetch';

type AuthenticateError = {
  readonly name: string;
};

type AuthenticateInput = {
  readonly username: string;
  readonly password: string;
};

type AuthenticateResult = {
  readonly token?: string;
  readonly err?: AuthenticateError;
};

type DoesAuthenticateResult = {
  readonly doesAuthenticate: boolean;
  readonly error?: string;
};

type CreateFetchAuthenticateInput = {
  readonly url: string;
};

const createFetchAuthenticate = ({
  url,
}: CreateFetchAuthenticateInput) => async ({
  username: email,
  password,
}: AuthenticateInput): Promise<AuthenticateResult> => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    return json;
  } catch (e) {
    return {
      err: {
        name: e,
      },
    };
  }
};

export const createFetchDoesAuthenticate = ({
  url,
}: CreateFetchAuthenticateInput) => async ({
  username,
  password,
}: AuthenticateInput): Promise<DoesAuthenticateResult> => {
  const fetchAuthenticate = createFetchAuthenticate({ url });

  const { token, err } = await fetchAuthenticate({ username, password });
  const doesAuthenticate = err === undefined && typeof token === `string`;

  if (doesAuthenticate) {
    return { doesAuthenticate };
  }

  const error = err && err.name ? err.name : `malformed token`;

  return {
    doesAuthenticate,
    error,
  };
};

export type FetchDoesAuthenticate = ReturnType<
  typeof createFetchDoesAuthenticate
>;
