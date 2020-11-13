import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { createHmac } from 'crypto';

type CreateCognitoServiceInput = {
  userPoolId: string;
  appClientId: string;
  appClientSecret: string;
  region: string;
};

type CognitoServiceInput = {
  userPoolId: string;
  appClientId: string;
  appClientSecret: string;
  cognitoIdentity: CognitoIdentityServiceProvider;
};

type SignUpInput = {
  email: string;
  username: string;
  password: string;
};

type SignUpOutput = {
  id: string;
  destination: string;
  deliveryMedium: string;
};

type ConfirmRegistrationInput = {
  username: string;
  code: string;
};

type ConfirmRegistrationResult = {
  status: string;
};

type ResendConfirmationCodeInput = {
  username: string;
};

type ResendConfirmationCodeResult = {
  destination: string;
  deliveryMedium: string;
};

type ForgotPasswordInput = {
  username: string;
};

type ForgotPasswordResult = {
  destination: string;
  deliveryMedium: string;
};

type ConfirmNewPasswordInput = {
  username: string;
  password: string;
  code: string;
};

type ConfirmNewPasswordResult = {
  status: string;
};

type AuthenticateUserInput = {
  username: string;
  password: string;
};

type AuthenticateUserResult = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
  tokenType: string;
};

type HashSecretInput = {
  username: string;
  appClientId: string;
  appClientSecret: string;
};

const hashSecret = ({
  username,
  appClientId,
  appClientSecret,
}: HashSecretInput): string => {
  return createHmac('SHA256', appClientSecret)
    .update(`${username}${appClientId}`)
    .digest('base64');
};

const cognitoService = ({
  userPoolId,
  appClientId,
  appClientSecret,
  cognitoIdentity,
}: CognitoServiceInput) => ({
  async signUp({
    email,
    username,
    password,
  }: SignUpInput): Promise<SignUpOutput> {
    const {
      UserSub: id,
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: deliveryMedium,
      },
    } = await cognitoIdentity
      .signUp({
        ClientId: appClientId,
        Password: password,
        Username: username,
        SecretHash: hashSecret({ username, appClientId, appClientSecret }),
        UserAttributes: [
          {
            Name: `email`,
            Value: email,
          },
        ],
      })
      .promise();

    return {
      id,
      destination,
      deliveryMedium,
    };
  },

  async confirmSignUp({
    username,
    code,
  }: ConfirmRegistrationInput): Promise<ConfirmRegistrationResult> {
    await cognitoIdentity
      .confirmSignUp({
        ClientId: appClientId,
        ConfirmationCode: code,
        Username: username,
        SecretHash: hashSecret({ username, appClientId, appClientSecret }),
      })
      .promise();

    return { status: `SUCCESS` };
  },

  async resendConfirmationCode({
    username,
  }: ResendConfirmationCodeInput): Promise<ResendConfirmationCodeResult> {
    const {
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: deliveryMedium,
      },
    } = await cognitoIdentity
      .resendConfirmationCode({
        ClientId: appClientId,
        Username: username,
        SecretHash: hashSecret({ username, appClientId, appClientSecret }),
      })
      .promise();

    return { destination, deliveryMedium };
  },

  async forgotPassword({
    username,
  }: ForgotPasswordInput): Promise<ForgotPasswordResult> {
    const {
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: deliveryMedium,
      },
    } = await cognitoIdentity
      .forgotPassword({
        ClientId: appClientId,
        Username: username,
        SecretHash: hashSecret({ username, appClientId, appClientSecret }),
      })
      .promise();

    return { destination, deliveryMedium };
  },

  async confirmNewPassword({ username, password, code }) {
    await cognitoIdentity
      .confirmForgotPassword({
        ClientId: appClientId,
        Username: username,
        Password: password,
        ConfirmationCode: code,
        SecretHash: hashSecret({ username, appClientId, appClientSecret }),
      })
      .promise();

    return { status: `success` };
  },

  async authenticateUser({
    username,
    password,
  }: AuthenticateUserInput): Promise<AuthenticateUserResult> {
    const {
      AuthenticationResult: {
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        IdToken: idToken,
        ExpiresIn: expiresIn,
        TokenType: tokenType,
      },
    } = await cognitoIdentity
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH' /* required */,
        ClientId: appClientId /* required */,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: hashSecret({ username, appClientId, appClientSecret }),
        },
      })
      .promise();

    return { accessToken, refreshToken, idToken, expiresIn, tokenType };
  },
});

export const createCognitoService = ({
  region,
  userPoolId,
  appClientId,
  appClientSecret,
}: CreateCognitoServiceInput) => {
  const cognitoIdentity = new CognitoIdentityServiceProvider({
    region,
  });

  return cognitoService({
    userPoolId,
    appClientId,
    appClientSecret,
    cognitoIdentity,
  });
};
