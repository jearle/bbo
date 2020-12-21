import { createCognitoProvider } from '../../../../providers/cognito';
import { createCognitoHealthService } from '../../services/cognito';

const {
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

test('healthy cognito health service', async () => {
  const healthService = await createCognitoHealthService({
    createCognitoProvider: async () =>
      await createCognitoProvider({
        region: COGNITO_REGION,
        userPoolId: COGNITO_USER_POOL_ID,
        appClientId: COGNITO_APP_CLIENT_ID,
        appClientSecret: COGNITO_APP_CLIENT_SECRET,
      }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(0);
});

test('unhealthy cognito health service', async () => {
  const healthService = await createCognitoHealthService({
    createCognitoProvider: async () => {
      throw new Error();
    },
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});
