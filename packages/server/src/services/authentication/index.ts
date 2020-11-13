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

export type AuthenticationService = {
  signUp({ email, username, password }: SignUpInput): Promise<SignUpOutput>;
  confirmSignUp({
    username,
    code,
  }: ConfirmSignUpInput): Promise<ConfirmSignUpResult>;
  resendConfirmationCode({
    username,
  }: ResendConfirmationCodeInput): Promise<ResendConfirmationCodeResult>;
  forgotPassword({
    username,
  }: ForgotPasswordInput): Promise<ForgotPasswordResult>;
  confirmNewPassword({
    username,
    password,
    code,
  }: ConfirmNewPasswordInput): Promise<ConfirmNewPasswordResult>;
  authenticateUser({
    username,
    password,
  }: AuthenticateUserInput): Promise<AuthenticateUserResult>;
  validate({ token }: ValidateInput): Promise<ValidateResult>;
};
