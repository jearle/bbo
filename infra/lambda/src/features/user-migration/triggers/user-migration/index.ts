type Request = {
  readonly password: string;
};

type Event = {
  readonly username: string;
  readonly triggerSource:
    | `UserMigration_Authentication`
    | `UserMigration_ForgotPassword`;
  readonly request: Request;
};

type Context = {
  readonly succeed: (event: Event) => void;
};

type Callback = (error: String) => void;

export const userMigrationTrigger = async (
  event: Event,
  context: Context,
  callback: Callback
): Promise<any> => {
  console.log('Cognito UserMigration Feature Trigger...');
  console.log(event);
  console.log(context);
  console.log(callback);

  return Promise.resolve();
};
