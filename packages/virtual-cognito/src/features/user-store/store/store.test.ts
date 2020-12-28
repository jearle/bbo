import { createUserStore } from '.';

const DEFAULT_USERNAME = `jearle@rcanalytics.com`;
const DEFAULT_PASSWORD = `=Z9-xW%7`;

describe(`store`, () => {
  test(`createUserStore`, () => {
    const store = createUserStore();

    expect(store).not.toBeUndefined();
  });

  test(`getValidatedUser valid`, () => {
    const store = createUserStore();

    const { username } = store.getValidatedUser({
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
    });

    expect(username).toBe(DEFAULT_USERNAME);
  });

  test(`getValidatedUser invalid`, () => {
    const store = createUserStore();

    const { isInvalid } = store.getValidatedUser({
      username: `invalid`,
      password: DEFAULT_PASSWORD,
    });

    expect(isInvalid).toBe(true);
  });

  test(`createUser`, () => {
    const store = createUserStore();

    const username = `test-user@rcanalytics.com`;
    const password = `foobar`;

    store.createUser({ username, password });

    const newUser = store.getValidatedUser({ username, password });

    expect(newUser.username).toEqual(username);
  });

  test(`createUser`, () => {
    const store = createUserStore();

    const username = `test-user@rcanalytics.com`;
    const password = `foobar`;

    store.createUser({ username, password });

    expect(() => {
      store.createUser({ username, password });
    }).toThrowError();
  });
});
