/* istanbul ignore file */

import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { createHmac } from 'crypto';
import { createTokenValidator, TokenValidator } from './token-validator';

type CreateCognitoServiceInput = {
  userPoolId: string;
  appClientId: string;
  appClientSecret: string;
  region: string;
};

type CognitoServiceInput = {
  appClientId: string;
  appClientSecret: string;
  cognitoIdentity: CognitoIdentityServiceProvider;
  tokenValidator: TokenValidator;
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

type ConfirmSignUpInput = {
  username: string;
  code: string;
};

type ConfirmSignUpResult = {
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

type ValidateInput = {
  token: string;
};

type ValidateResult = {
  username: string;
  [key: string]: any;
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
  appClientId,
  appClientSecret,
  cognitoIdentity,
  tokenValidator,
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
  }: ConfirmSignUpInput): Promise<ConfirmSignUpResult> {
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

  async confirmNewPassword({
    username,
    password,
    code,
  }: ConfirmNewPasswordInput): Promise<ConfirmNewPasswordResult> {
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

  async validate({ token }: ValidateInput): Promise<ValidateResult> {
    const result = await tokenValidator.validate({ token });

    return result;
  },
});

export type CognitoService = ReturnType<typeof cognitoService>;

export const createCognitoService = async ({
  region,
  userPoolId,
  appClientId,
  appClientSecret,
}: CreateCognitoServiceInput) => {
  const cognitoIdentity = new CognitoIdentityServiceProvider({
    region,
  });

  const tokenValidator = await createTokenValidator({
    region,
    userPoolId,
    tokenUse: `access`,
    maxAge: 3600,
  });

  return cognitoService({
    appClientId,
    appClientSecret,
    cognitoIdentity,
    tokenValidator,
  });
};
