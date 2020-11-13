import { createCognitoService } from '.';

const {
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

describe(`cognitoService`, () => {
  // let cognitoService = null;

  // beforeEach(() => {
  //   cognitoService = createCognitoService({
  //     region: COGNITO_REGION,
  //     userPoolId: COGNITO_USER_POOL_ID,
  //     appClientId: COGNITO_APP_CLIENT_ID,
  //   });
  // });

  test.skip(`signUp`, async () => {
    const cognitoService = createCognitoService({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });
    const user = await cognitoService.signUp({
      email: `jearle@rcanalytics.com`,
      username: `jearle@rcanalytics.com`,
      password: `5ohgrinD@`,
    });
    console.log(user);
  });

  test.skip(`confirmRegistration`, async () => {
    const cognitoService = createCognitoService({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });

    const user = await cognitoService.confirmRegistration({
      username: `jearle@rcanalytics.com`,
      code: `971349`,
    });

    console.log(user);
  });

  test.skip(`resendConfirmationCode`, async () => {
    const cognitoService = createCognitoService({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });

    const confirmationDetails = await cognitoService.resendConfirmationCode({
      username: `jearle@rcanalytics.com`,
    });

    console.log(confirmationDetails);
  });

  test.skip(`authenticateUser`, async () => {
    const cognitoService = createCognitoService({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });

    const result = await cognitoService.authenticateUser({
      username: `jearle@rcanalytics.com`,
      password: `5ohgrinD@`,
    });

    console.log(result);
  });
});
