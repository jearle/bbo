import { createCognitoService } from './cognito';

const {
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

describe(`cognitoService`, () => {
  const cognitoService = createCognitoService({
    region: COGNITO_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    appClientId: COGNITO_APP_CLIENT_ID,
    appClientSecret: COGNITO_APP_CLIENT_SECRET,
  });

  test.skip(`signUp`, async () => {
    const result = await cognitoService.signUp({
      email: `jearle@rcanalytics.com`,
      username: `user-for-tests1`,
      password: `=Z9-xW%7`,
    });

    console.log(result);
  });

  test.skip(`authenticateUser`, async () => {
    const result = await cognitoService.authenticateUser({
      username: `user-for-tests1`,
      password: `=Z9-xW%7`,
    });

    console.log(result);
  });

  test.skip(`confirmSignUp`, async () => {
    const result = await cognitoService.confirmSignUp({
      username: `user-for-tests`,
      code: `582028`,
    });

    console.log(result);
  });

  test.skip(`resendConfirmationCode`, async () => {
    const result = await cognitoService.resendConfirmationCode({
      username: `user-for-tests`,
    });

    console.log(result);
  });

  test.skip(`forgotPassword`, async () => {
    const result = await cognitoService.forgotPassword({
      username: `user-for-tests`,
    });

    console.log(result);
  });

  test.skip(`confirmNewPassword`, async () => {
    const result = await cognitoService.confirmNewPassword({
      username: `user-for-tests`,
      password: `=Z9-xW%7`,
      code: `781400`,
    });

    console.log(result);
  });
});
