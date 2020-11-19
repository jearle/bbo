import { createCognitoService, CognitoService } from '.';

const {
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

describe(`cognitoService`, () => {
  let cognitoService: CognitoService;

  beforeAll(async () => {
    cognitoService = await createCognitoService({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });
  });

  test(`cognitoService`, () => {
    expect(cognitoService).toBeTruthy();
  });
});
