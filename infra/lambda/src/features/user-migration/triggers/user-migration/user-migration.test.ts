import { createUserMigrationTrigger } from '.';
import {
  UserMigrationEvent,
  UserMigrationContext,
  TriggerSource,
} from './types';
import { createFetchDoesAuthenticate } from '../../services/authenticate';

const { TEST_USERNAME, TEST_PASSWORD } = process.env;

const url = `https://test.rcanalytics.com/api/v2/authentication/login`;
const fetchDoesAuthenticate = createFetchDoesAuthenticate({ url });

type CreateMockUserMigrationEventInputs = {
  readonly username?: string;
  readonly password?: string;
  readonly triggerSource?: TriggerSource;
};
const createMockUserMigrationEvent = ({
  username: userName = TEST_USERNAME,
  password = TEST_PASSWORD,
  triggerSource = `UserMigration_Authentication`,
}: CreateMockUserMigrationEventInputs = {}): UserMigrationEvent => ({
  version: `1`,
  triggerSource,
  region: `us-east-1`,
  userPoolId: `us-east-1_RpMNfhlFg`,
  userName,
  callerContext: {
    awsSdkVersion: `aws-sdk-nodejs-2.793.0`,
    clientId: `mumtcb5anrnlemionpqejqf4h`,
  },
  request: {
    password,
    validationData: null,
    userAttributes: null,
  },
  response: {
    userAttributes: null,
    forceAliasCreation: null,
    finalUserStatus: null,
    messageAction: null,
    desiredDeliveryMediums: null,
  },
});

const createMockUserMigrationContext = ({
  succeed = (event: UserMigrationEvent) => {},
} = {}): UserMigrationContext => ({
  succeed,
  callbackWaitsForEmptyEventLoop: true,
  functionVersion: `$LATEST`,
  functionName: `cd_product_api_dev_cognito_user_migration_lambda_function`,
  memoryLimitInMB: `128`,
  logGroupName: `/aws/lambda/cd_product_api_dev_cognito_user_migration_lambda_function`,
  logStreamName: `2021/03/02/[$LATEST]b147779eefa741cab968ccd26a7fb1c6`,
  invokedFunctionArn: `arn:aws:lambda:us-east-1:861401221793:function:cd_product_api_dev_cognito_user_migration_lambda_function`,
  awsRequestId: `72bac557-65ed-4aee-a25e-7420a79c890c`,
});

describe(`userMigrationTrigger`, () => {
  let userMigrationEvent: UserMigrationEvent = null;
  let userMigrationContext: UserMigrationContext = null;

  beforeEach(() => {
    userMigrationEvent = createMockUserMigrationEvent();
    userMigrationContext = createMockUserMigrationContext();
  });

  test(`valid user succeeds`, async () => {
    const userMigrationTrigger = createUserMigrationTrigger({
      fetchDoesAuthenticate,
    });

    userMigrationContext = createMockUserMigrationContext({
      succeed(event) {
        const {
          userAttributes,
          finalUserStatus,
          messageAction,
        } = event.response;
        const { email, email_verified } = userAttributes;

        expect(email).toBe(TEST_USERNAME);
        expect(email_verified).toBe(`true`);
        expect(finalUserStatus).toBe(`CONFIRMED`);
        expect(messageAction).toBe(`SUPPRESS`);
      },
    });

    await userMigrationTrigger(
      userMigrationEvent,
      userMigrationContext,
      (error) => {
        expect(error).toBe(null);
      }
    );
  });

  test(`invalid user fails`, async () => {
    const userMigrationTrigger = createUserMigrationTrigger({
      fetchDoesAuthenticate,
    });

    userMigrationEvent = createMockUserMigrationEvent({
      password: `badpassword`,
    });

    await userMigrationTrigger(
      userMigrationEvent,
      userMigrationContext,
      (error) => {
        expect(error).toBe(`Unauthorized`);
      }
    );
  });

  test(`invalid triggerSource`, async () => {
    const userMigrationTrigger = createUserMigrationTrigger({
      fetchDoesAuthenticate,
    });

    const triggerSource: TriggerSource = `FooBar` as TriggerSource;

    userMigrationEvent = createMockUserMigrationEvent({
      triggerSource,
    });

    await userMigrationTrigger(
      userMigrationEvent,
      userMigrationContext,
      (error) => {
        expect(error).toMatch(/unknown/);
      }
    );
  });
});
