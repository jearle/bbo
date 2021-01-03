import { Request } from 'express';
import { createInitiateAuth } from '.';
import { createUserStoreFeature } from '../../user-store';

type CreateRequestInput = {
  readonly username?: string;
  readonly password?: string;
};

const DEFAULT_USERNAME = `jearle@rcanalytics.com`;
const DEFAULT_PASSWORD = `=Z9-xW%7`;

const createRequest = ({
  username = DEFAULT_USERNAME,
  password = DEFAULT_PASSWORD,
}: CreateRequestInput = {}): Request => ({
  body: { AuthParameters: { USERNAME: username, PASSWORD: password } },
});

describe(`initiateAuth`, () => {
  const { userStore } = createUserStoreFeature();
  const initiateAuth = createInitiateAuth({ userStore });

  test(`initiateAuth success`, async () => {
    const request = createRequest();

    const {
      body: {
        AuthenticationResult: { AccessToken: accessToken },
      },
    } = await initiateAuth(request);

    expect(typeof accessToken).toBe(`string`);
  });

  test(`initiateAuth failure`, async () => {
    const request = createRequest({ username: `foo` });

    const {
      body: { message },
    } = await initiateAuth(request);

    expect(/incorrect/i.test(message)).toBe(true);
  });
});
