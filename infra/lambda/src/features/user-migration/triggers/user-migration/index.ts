import {
  UserMigrationCallback,
  UserMigrationEvent,
  UserMigrationContext,
} from './types';
import { FetchDoesAuthenticate } from '../../services/authenticate';
import { userMigrationAuthentication } from './trigger-source/authentication';

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
  const { userName: username, triggerSource } = event;
  const { password } = event.request;

  if (triggerSource === `UserMigration_Authentication`) {
    return await userMigrationAuthentication({
      username,
      password,
      event,
      context,
      fetchDoesAuthenticate,
      callback,
    });
  }

  return callback(`unknown triggerSource: "${triggerSource}"`);
};
