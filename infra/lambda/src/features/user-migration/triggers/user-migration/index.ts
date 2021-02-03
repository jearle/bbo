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
  console.log('Cognito UserMigration Feature Trigger...');
  console.log(fetchDoesAuthenticate);
  console.log(event);
  console.log(context);
  console.log(callback);

  return Promise.resolve();
};
