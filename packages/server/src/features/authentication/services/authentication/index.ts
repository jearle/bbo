import { createHmac } from 'crypto';
import { CognitoProvider } from '../../providers/cognito';

type CreateAuthenticationServiceInputs = {
  cognitoService: CognitoProvider;
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

const authenticationService = ({
  appClientId,
  appClientSecret,
  cognitoIdentity,
  tokenValidator,
}: CognitoProvider) => ({
  /* istanbul ignore next */
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

  /* istanbul ignore next */
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

  /* istanbul ignore next */
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

  /* istanbul ignore next */
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

  /* istanbul ignore next */
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

export type AuthenticationService = ReturnType<typeof authenticationService>;

export const createAuthenticationService = ({
  cognitoService,
}: CreateAuthenticationServiceInputs): AuthenticationService => {
  return authenticationService(cognitoService);
};
