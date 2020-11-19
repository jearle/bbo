import { createAuthenticationService, AuthenticationService } from '.';
import { createCognitoService, CognitoService } from '../cognito';

const {
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

const USERNAME = `user-for-tests`;
const PASSWORD = `=Z9-xW%7`;
const EMAIL = `jearle@rcanalytics.com`;
const CONFIRM_SIGN_UP_CODE = `837889`;

describe(`authenticationService`, () => {
  let cognitoService: CognitoService;
  let authenticationService: AuthenticationService;

  beforeAll(async () => {
    cognitoService = await createCognitoService({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });

    authenticationService = await createAuthenticationService({
      cognitoService,
    });
  });

  test.skip(`signUp`, async () => {
    const result = await authenticationService.signUp({
      email: EMAIL,
      username: USERNAME,
      password: PASSWORD,
    });

    console.log(result);
  });

  test.skip(`confirmSignUp`, async () => {
    const result = await authenticationService.confirmSignUp({
      username: USERNAME,
      code: CONFIRM_SIGN_UP_CODE,
    });

    console.log(result);
  });

  test.skip(`resendConfirmationCode`, async () => {
    const result = await authenticationService.resendConfirmationCode({
      username: USERNAME,
    });

    console.log(result);
  });

  test.skip(`forgotPassword`, async () => {
    const result = await authenticationService.forgotPassword({
      username: USERNAME,
    });

    console.log(result);
  });

  test.skip(`confirmNewPassword`, async () => {
    const result = await authenticationService.confirmNewPassword({
      username: USERNAME,
      password: PASSWORD,
      code: `781400`,
    });

    console.log(result);
  });

  test(`authenticateUser`, async () => {
    const { accessToken } = await authenticationService.authenticateUser({
      username: USERNAME,
      password: PASSWORD,
    });

    expect(accessToken.length).toBeGreaterThan(0);
  });

  test(`validate`, async () => {
    const { accessToken } = await authenticationService.authenticateUser({
      username: USERNAME,
      password: PASSWORD,
    });

    const { username } = await authenticationService.validate({
      token: accessToken,
    });

    expect(username).toBe(USERNAME);
  });
});
