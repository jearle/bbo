import { Request } from 'express';
import { createInitiateAuth } from '.';
import { createUserStoreFeature } from '../../user-store';

type CreateRequestInput = {
  readonly username?: string;
  readonly password?: string;
  readonly clientId?: string;
};

const DEFAULT_USERNAME = `jearle@rcanalytics.com`;
const DEFAULT_PASSWORD = `=Z9-xW%7`;
const DEFAULT_CLIENT_ID = `foo`;

const createRequest = ({
  username = DEFAULT_USERNAME,
  password = DEFAULT_PASSWORD,
  clientId: ClientId = DEFAULT_CLIENT_ID,
}: CreateRequestInput = {}): Request => ({
  body: {
    ClientId,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  },
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

  test(`initiateAuth success bad issuer`, async () => {
    const request = createRequest({ clientId: `bad-issuer` });

    const {
      body: {
        AuthenticationResult: { AccessToken: accessToken },
      },
    } = await initiateAuth(request);

    expect(Buffer.from(accessToken.split(`.`)[1], 'base64').toString()).toMatch(
      /http:\/\/bad-issuer/
    );
  });

  test(`initiateAuth success bad token use`, async () => {
    const request = createRequest({ clientId: `bad-token-use` });

    const {
      body: {
        AuthenticationResult: { AccessToken: accessToken },
      },
    } = await initiateAuth(request);

    expect(Buffer.from(accessToken.split(`.`)[1], 'base64').toString()).toMatch(
      /bad_use/
    );
  });

  test(`initiateAuth success bad token`, async () => {
    const badRequest = createRequest({ clientId: `bad-token` });

    const {
      body: {
        AuthenticationResult: { AccessToken: accessToken },
      },
    } = await initiateAuth(badRequest);

    expect(accessToken.length).toBeGreaterThan(0);
  });

  test(`initiateAuth success bad kid`, async () => {
    const badRequest = createRequest({ clientId: `bad-kid` });

    const {
      body: {
        AuthenticationResult: { AccessToken: accessToken },
      },
    } = await initiateAuth(badRequest);

    expect(Buffer.from(accessToken.split(`.`)[0], 'base64').toString()).toMatch(
      /bad-kid/
    );
  });

  test(`initiateAuth failure`, async () => {
    const request = createRequest({ username: `foo` });

    const {
      body: { message },
    } = await initiateAuth(request);

    expect(/incorrect/i.test(message)).toBe(true);
  });
});
