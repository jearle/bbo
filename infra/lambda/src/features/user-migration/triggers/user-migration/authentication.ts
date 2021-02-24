import {
  UserMigrationEvent,
  UserMigrationContext,
  UserMigrationCallback,
} from './types';

import { FetchDoesAuthenticate } from '../../services/authenticate';

type MutateAuthenticatedEventInput = {
  readonly event: UserMigrationEvent;
  readonly username: string;
};

type UserMigrationAuthenticationInput = {
  readonly fetchDoesAuthenticate: FetchDoesAuthenticate;
  readonly event: UserMigrationEvent;
  readonly context: UserMigrationContext;
  readonly callback: UserMigrationCallback;
};

const mutateAuthenticatedEvent = ({
  event,
  username,
}: MutateAuthenticatedEventInput): void => {
  event.response.userAttributes = {
    email: username,
    email_verified: `true`,
  };
  event.response.finalUserStatus = `CONFIRMED`;
  event.response.messageAction = `SUPPRESS`;
};

export const userMigrationAuthentication = async ({
  fetchDoesAuthenticate,
  event,
  context,
  callback,
}: UserMigrationAuthenticationInput) => {
  const { userName: username } = event;
  const { password } = event.request;

  console.log(`Authenticating user`);
  const { doesAuthenticate, error } = await fetchDoesAuthenticate({
    username,
    password,
  });

  console.log(`check does authenticate`);
  if (!doesAuthenticate) {
    console.log(`does not authenticate error`, error);
    return callback(error);
  }
  console.log(`does authenticate`);

  console.log(`making successful event`);
  mutateAuthenticatedEvent({ event, username });

  context.succeed(event);
  callback(null);
};
