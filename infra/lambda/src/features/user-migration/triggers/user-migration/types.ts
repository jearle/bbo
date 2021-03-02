type UserMigrationCallerContext = {
  readonly awsSdkVersion: `aws-sdk-nodejs-2.793.0`;
  readonly clientId: `mumtcb5anrnlemionpqejqf4h`;
};

type UserMigrationRequest = {
  readonly password: string;
  readonly validationData?: unknown;
  readonly userAttributes?: unknown;
};

type UserAttributes = {
  readonly email: string;
  readonly email_verified: string;
};

type UserMigrationResponse = {
  readonly forceAliasCreation?: unknown;
  readonly desiredDeliveryMediums?: unknown;
  userAttributes: UserAttributes | null;
  finalUserStatus?: `CONFIRMED`;
  messageAction?: `SUPPRESS`;
};

export type TriggerSource =
  | `UserMigration_Authentication`
  | `UserMigration_ForgotPassword`;

export type UserMigrationCallback = (error?: string | null) => void;

export type UserMigrationEvent = {
  readonly version: string;
  readonly userName: string;
  readonly triggerSource: TriggerSource;
  readonly region: string;
  readonly userPoolId: string;
  readonly request: UserMigrationRequest;
  readonly callerContext: UserMigrationCallerContext;
  response: UserMigrationResponse;
};

export type UserMigrationContext = {
  readonly succeed: (event: UserMigrationEvent) => void;
  readonly callbackWaitsForEmptyEventLoop: boolean;
  readonly functionVersion: string;
  readonly functionName: string;
  readonly memoryLimitInMB: string;
  readonly logGroupName: string;
  readonly logStreamName: string;
  readonly invokedFunctionArn: string;
  readonly awsRequestId: string;
};
