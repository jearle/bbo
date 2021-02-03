import { createFetchDoesAuthenticate } from './';

const url = `https://test.rcanalytics.com/api/v2/authentication/login`;

describe(`fetchDoesAuthenticate`, () => {
  const fetchDoesAuthenticate = createFetchDoesAuthenticate({ url });

  test(`invalid credentials`, async () => {
    const { doesAuthenticate } = await fetchDoesAuthenticate({
      username: `jearle@rcanalytics.com`,
      password: `foo`,
    });

    expect(doesAuthenticate).toBe(false);
  });
});
