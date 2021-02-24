import {
  UserMigrationEvent,
  UserMigrationContext,
  UserMigrationCallback,
} from './types';

import { userMigrationAuthentication } from './authentication';

import { FetchDoesAuthenticate } from '../../services/authenticate';

type CreateUserMigrationTriggerInput = {
  readonly fetchDoesAuthenticate: FetchDoesAuthenticate;
};

export const createUserMigrationTrigger = ({
  fetchDoesAuthenticate,
}: CreateUserMigrationTriggerInput) => async (
  event: UserMigrationEvent,
  context: UserMigrationContext,
  callback: UserMigrationCallback
) => {
  const { triggerSource } = event;

  if (triggerSource !== `UserMigration_Authentication`)
    return userMigrationAuthentication({
      fetchDoesAuthenticate,
      event,
      context,
      callback,
    });
};
