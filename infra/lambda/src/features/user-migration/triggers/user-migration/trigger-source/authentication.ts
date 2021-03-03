import {
  UserMigrationCallback,
  UserMigrationEvent,
  UserMigrationContext,
} from '../types';
import { FetchDoesAuthenticate } from '../../../services/authenticate';

type UserMigrationAuthenticationInputs = {
  readonly username: string;
  readonly password: string;
  readonly event: UserMigrationEvent;
  readonly context: UserMigrationContext;
  readonly fetchDoesAuthenticate: FetchDoesAuthenticate;
  readonly callback: UserMigrationCallback;
};

export const userMigrationAuthentication = async ({
  username,
  password,
  event,
  context,
  fetchDoesAuthenticate,
  callback,
}: UserMigrationAuthenticationInputs) => {
  const { doesAuthenticate, error } = await fetchDoesAuthenticate({
    username,
    password,
  });

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

  console.log(`success`);

  context.succeed(event);

  callback(null);
};
