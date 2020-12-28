export type SignUpResponse = {
  readonly statusCode: number;
  readonly body: any; // eslint-disable-line
};

type CreateSignUpSuccessInput = {
  readonly username: string;
};

const createRedactedEmail = ({ email }) => {
  const [username, domain] = email.split(`@`);
  const topLevelDomain = domain.match(/\..+$/)[0];
  const redactedUsername = username[0] + `***`;
  const redactedDomain = domain[0] + `***`;

  return `${redactedUsername}@${redactedDomain}${topLevelDomain}`;
};

export const createSignUpSuccess = ({
  username,
}: CreateSignUpSuccessInput): SignUpResponse => {
  return {
    statusCode: 200,
    body: JSON.parse(`{
      "CodeDeliveryDetails": {
        "AttributeName":"email",
        "DeliveryMedium":"EMAIL",
        "Destination":"${createRedactedEmail({ email: username })}"
      },
      "UserConfirmed":false,
      "UserSub":"8b3077b6-513d-4fb2-ab34-3cf80a681a52"
    }`),
  };
};

export const createSignUpFailure = (): SignUpResponse => ({
  statusCode: 400,
  body: JSON.parse(`{
    "__type": "UsernameExistsException",
    "message": "User already exists"
  }`),
});
