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
  readonly username: string;
  readonly triggerSource:
    | `UserMigration_Authentication`
    | `UserMigration_ForgotPassword`;
  readonly request: Request;
  readonly response: Response;
};

type Context = {
  readonly succeed: (event: Event) => void;
};

type Callback = (error: String) => void;

type CreateUserMigrationTriggerInput = {
  readonly fetchDoesAuthenticate: FetchDoesAuthenticate;
};

export const createUserMigrationTrigger = ({
  fetchDoesAuthenticate,
}: CreateUserMigrationTriggerInput) => async (
  event: Event,
  context: Context,
  callback: Callback
): Promise<any> => {
  const { username } = event;
  const { password } = event.request;

  const { doesAuthenticate, error } = await fetchDoesAuthenticate({
    username,
    password,
  });

  console.log(`cognito!`);
  console.log(`username`, username);
  console.log(`password`, password);
  console.log(`doesAuthenticate`, doesAuthenticate);
  console.log(`error`, error);

  return Promise.resolve();
};
