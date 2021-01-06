import { createCognitoProvider } from '.';
import { hashSecret } from './helpers/hash-secret';
import {
  CREDENTIALS,
  COGNITO_CONFIG,
  LOCALHOST_COGNITO_CONFIG,
} from './helpers/test/data';

const { username, password } = CREDENTIALS;
const {
  region: cognitoRegion,
  userPoolId: cognitoUserPoolId,
  appClientId: cognitoAppClientId,
  appClientSecret,
} = COGNITO_CONFIG;
const { region: localhostRegion } = LOCALHOST_COGNITO_CONFIG;

describe(`cognitoProvider`, () => {
  const createTestCognitoProvider = async ({
    region,
    userPoolId = cognitoUserPoolId,
    appClientId = cognitoAppClientId,
  }) => {
    const cognitoProvider = createCognitoProvider({
      region,
      userPoolId,
      appClientId,
      appClientSecret,
    });

    return cognitoProvider;
  };

  const initiateAuth = async (cognitoProvider) => {
    const { cognitoIdentity, appClientId } = cognitoProvider;

    const {
      AuthenticationResult: { AccessToken: accessToken },
    } = await cognitoIdentity
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH' /* required */,
        ClientId: appClientId /* required */,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: hashSecret({
            username,
            appClientId,
            appClientSecret,
          }),
        },
      })
      .promise();

    return { accessToken };
  };

  const testCognitoProvider = async (cognitoProvider) => {
    const { accessToken } = await initiateAuth(cognitoProvider);

    expect(accessToken.length).toBeGreaterThan(0);
  };

  const testTokenValidator = async ({ region }) => {
    const cognitoProvider = await createTestCognitoProvider({
      region,
    });
    const { accessToken } = await initiateAuth(cognitoProvider);

    const { tokenValidator } = cognitoProvider;

    const { token_use: tokenUse } = await tokenValidator.validate({
      token: accessToken,
    });

    expect(tokenUse).toBe(`access`);
  };

  test(`cognito`, async () => {
    const cognitoProvider = await createTestCognitoProvider({
      region: cognitoRegion,
    });
    await testCognitoProvider(cognitoProvider);
  });

  test(`virtual cognito`, async () => {
    const cognitoProvider = await createTestCognitoProvider({
      region: localhostRegion,
    });
    await testCognitoProvider(cognitoProvider);
  });

  test(`validate cognito region`, async () => {
    await testTokenValidator({ region: cognitoRegion });
  });

  test(`validate local region`, async () => {
    await testTokenValidator({ region: localhostRegion });
  });

  test(`validate no region`, async () => {
    try {
      await createTestCognitoProvider({
        region: null,
      });
    } catch ({ message }) {
      expect(message).toMatch(/region/);
    }
  });

  test(`validate no userPoolId`, async () => {
    try {
      await createTestCognitoProvider({
        region: cognitoRegion,
        userPoolId: null,
      });
    } catch ({ message }) {
      expect(message).toMatch(/userPoolId/);
    }
  });

  test(`bad issuer`, async () => {
    const cognitoProvider = await createTestCognitoProvider({
      region: localhostRegion,
      appClientId: `bad-issuer`,
    });

    const { accessToken } = await initiateAuth(cognitoProvider);

    const { tokenValidator } = cognitoProvider;

    try {
      await tokenValidator.validate({
        token: accessToken,
      });
    } catch ({ message }) {
      expect(message).toMatch(/issuer/);
    }
  });

  test(`bad token use`, async () => {
    const cognitoProvider = await createTestCognitoProvider({
      region: localhostRegion,
      appClientId: `bad-token-use`,
    });

    const { accessToken } = await initiateAuth(cognitoProvider);

    const { tokenValidator } = cognitoProvider;

    try {
      await tokenValidator.validate({
        token: accessToken,
      });
    } catch ({ message }) {
      expect(message).toMatch(/access/);
    }
  });

  test(`bad token`, async () => {
    const cognitoProvider = await createTestCognitoProvider({
      region: localhostRegion,
      appClientId: `bad-token`,
    });

    const { accessToken } = await initiateAuth(cognitoProvider);

    const { tokenValidator } = cognitoProvider;

    try {
      await tokenValidator.validate({
        token: accessToken,
      });
    } catch ({ message }) {
      expect(message).toMatch(/invalid signature/);
    }
  });

  test(`bad kid`, async () => {
    const cognitoProvider = await createTestCognitoProvider({
      region: localhostRegion,
      appClientId: `bad-kid`,
    });

    const { accessToken } = await initiateAuth(cognitoProvider);

    const { tokenValidator } = cognitoProvider;

    try {
      await tokenValidator.validate({
        token: accessToken,
      });
    } catch ({ message }) {
      expect(message).toMatch(/kid/);
    }
  });
});
