// exports.Login = function (body, callback) {
//   var userName = body.name;
//   var password = body.password;
//   var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
//     Username: userName,
//     Password: password,
//   });
//   var userData = {
//     Username: userName,
//     Pool: userPool,
//   };
//   var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
//   cognitoUser.authenticateUser(authenticationDetails, {
//     onSuccess: function (result) {
//       var accesstoken = result.getAccessToken().getJwtToken();
//       callback(null, accesstoken);
//     },
//     onFailure: function (err) {
//       callback(err);
//     },
//   });
// };

//
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  CognitoUserSession,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

type AuthenticateUserInput = {
  username: string;
  password: string;
};

type AuthenticateUserResult = {
  jwtToken: string;
};

const authenticateUser = (userPool: CognitoUserPool) => async ({
  username,
  password,
}: AuthenticateUserInput): Promise<AuthenticateUserResult> => {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const promise: Promise<AuthenticateUserResult> = new Promise(
    (resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess(cognitoUserSession: CognitoUserSession) {
          const jwtToken = cognitoUserSession.getAccessToken().getJwtToken();

          resolve({ jwtToken });
        },
        onFailure(err) {
          reject(err);
        },
      });
    }
  );

  return promise;
};

type SignUpInput = {
  email: string;
  username: string;
  password: string;
};

const signUp = (userPool: CognitoUserPool) => ({
  email,
  username,
  password,
}: SignUpInput): Promise<CognitoUser> => {
  const attributeList = [
    new CognitoUserAttribute({
      Name: `email`,
      Value: email,
    }),
  ];

  const promise: Promise<CognitoUser> = new Promise((resolve, reject) =>
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) return reject(err);

      const { user } = result;

      console.log(result);

      resolve(user);
    })
  );

  return promise;
};

type ConfirmRegistrationInput = {
  username: string;
  code: string;
};

type ConfirmRegistrationResult = {
  status: `SUCCESS`;
};

const confirmRegistration = (userPool: CognitoUserPool) => ({
  username,
  code,
}: ConfirmRegistrationInput): Promise<ConfirmRegistrationResult> => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const promise: Promise<ConfirmRegistrationResult> = new Promise(
    (resolve, reject) =>
      user.confirmRegistration(code, false, (err, result) => {
        if (err) return reject(err);

        const confirmRegistrationResult: ConfirmRegistrationResult = {
          status: result,
        };

        resolve(confirmRegistrationResult);
      })
  );

  return promise;
};

type ResendConfirmationCodeInput = {
  username: string;
};

type ResendConfirmationResult = {
  deliveryMedium: `EMAIL`;
  destination: string;
};

const resendConfirmationCode = (userPool: CognitoUserPool) => ({
  username,
}: ResendConfirmationCodeInput): Promise<ResendConfirmationResult> => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const promise: Promise<ResendConfirmationResult> = new Promise(
    (resolve, reject) =>
      user.resendConfirmationCode((err, result) => {
        if (err) return reject(err);

        const {
          CodeDeliveryDetails: { DeliveryMedium, Destination },
        } = result;

        const resendConfirmationResult = {
          deliveryMedium: DeliveryMedium,
          destination: Destination,
        };

        resolve(resendConfirmationResult);
      })
  );

  return promise;
};

type CognitoServiceInput = {
  region: string;
  userPoolId: string;
  appClientId: string;
};

type CognitoService = {
  authenticateUser(
    authenticateUserInput: AuthenticateUserInput
  ): Promise<AuthenticateUserResult>;
  signUp(signUpInput: SignUpInput): Promise<CognitoUser>;
  confirmRegistration(
    confirmRegistrationInput: ConfirmRegistrationInput
  ): Promise<ConfirmRegistrationResult>;
  resendConfirmationCode(
    resendConfirmationCodeInput: ResendConfirmationCodeInput
  ): Promise<ResendConfirmationResult>;
};

export const createCognitoService = ({
  region,
  userPoolId,
  appClientId,
}: CognitoServiceInput): CognitoService => {
  const userPool = new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: appClientId,
  });

  return {
    signUp: signUp(userPool),
    confirmRegistration: confirmRegistration(userPool),
    resendConfirmationCode: resendConfirmationCode(userPool),
    authenticateUser: authenticateUser(userPool),
  };
};
