import { FetchDoesAuthenticate } from '../../services/authenticate';

type Request = {
  readonly password: string;
};

type UserAttributes = {
  email: string;
  email_verified: string;
};

type Response = {
  userAttributes: UserAttributes;
  finalUserStatus?: `CONFIRMED`;
  messageAction?: `SUPPRESS`;
};

type Event = {
  readonly userName: string;
  readonly triggerSource:
    | `UserMigration_Authentication`
    | `UserMigration_ForgotPassword`;
  readonly request: Request;
  readonly response: Response;
};

type Context = {
  readonly succeed: (event: Event) => void;
};

type Callback = (error?: string | null) => void;

type CreateUserMigrationTriggerInput = {
  readonly fetchDoesAuthenticate: FetchDoesAuthenticate;
};

export const createUserMigrationTrigger = ({
  fetchDoesAuthenticate,
}: CreateUserMigrationTriggerInput) => async (
  event: Event,
  context: Context,
  callback: Callback
) => {
  const { userName: username, triggerSource } = event;
  const { password } = event.request;

  if (triggerSource === `UserMigration_Authentication`) {
    console.log(`UserMigration_Authentication`);
    const { doesAuthenticate, error } = await fetchDoesAuthenticate({
      username,
      password,
    });

    console.log(`Does Authenticate`, doesAuthenticate);
    if (!doesAuthenticate) {
      console.log(`does not authenticate error`, error);
      return callback(error);
    }

    event.response.userAttributes = {
      email: username,
      email_verified: `true`,
    };
    event.response.finalUserStatus = `CONFIRMED`;
    event.response.messageAction = `SUPPRESS`;

    console.log(`succeed`, event);

    context.succeed(event);
    callback(null);
    return;
  }

  // console.log(`cognito!`);
  // console.log(`username`, username);
  // console.log(`password`, password);
  // console.log(`doesAuthenticate`, doesAuthenticate);
  // console.log(`error`, error);

  return;
};
