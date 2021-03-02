import { createFetchDoesAuthenticate } from './';

const { TEST_USERNAME: username, TEST_PASSWORD: password } = process.env;

const url = `https://test.rcanalytics.com/api/v2/authentication/login`;

describe(`fetchDoesAuthenticate`, () => {
  const fetchDoesAuthenticate = createFetchDoesAuthenticate({ url });

  test(`valid credentials`, async () => {
    const { doesAuthenticate } = await fetchDoesAuthenticate({
      username,
      password,
    });

    expect(doesAuthenticate).toBe(true);
  });

  test(`invalid credentials`, async () => {
    const { doesAuthenticate } = await fetchDoesAuthenticate({
      username: `foobar@rcanalytics.com`,
      password: `foo`,
    });

    expect(doesAuthenticate).toBe(false);
  });

  test(`fetch error`, async () => {
    const fetchDoesAuthenticate = createFetchDoesAuthenticate({
      url: `https://bad-url`,
    });

    const { error } = await fetchDoesAuthenticate({
      username: `jearle@rcanalytics.com`,
      password: `foo`,
    });

    expect(error).not.toBe(undefined);
  });
});
