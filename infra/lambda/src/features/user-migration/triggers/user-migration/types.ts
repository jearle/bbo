type UserMigrationRequest = {
  readonly password: string;
};

type UserAttributes = {
  email: string;
  email_verified: string;
};

type UserMigrationResponse = {
  userAttributes: UserAttributes;
  finalUserStatus?: `CONFIRMED`;
  messageAction?: `SUPPRESS`;
};

export type UserMigrationEvent = {
  readonly userName: string;
  readonly triggerSource:
    | `UserMigration_Authentication`
    | `UserMigration_ForgotPassword`;
  readonly request: UserMigrationRequest;
  readonly response: UserMigrationResponse;
};

export type UserMigrationContext = {
  readonly succeed: (event: UserMigrationEvent) => void;
};

export type UserMigrationCallback = (error?: string | null) => void;
