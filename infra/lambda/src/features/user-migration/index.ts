import { createFetchDoesAuthenticate } from './services/authenticate';
import { createUserMigrationTrigger } from './triggers/user-migration';

const url = `https://test.rcanalytics.com/api/v2/authentication/login`;
const fetchDoesAuthenticate = createFetchDoesAuthenticate({ url });

const userMigrationFeature = () => ({
  userMigrationTrigger: createUserMigrationTrigger({ fetchDoesAuthenticate }),
});

type UserMigrationFeature = ReturnType<typeof userMigrationFeature>;

export const createUserMigrationFeature = (): UserMigrationFeature => {
  return userMigrationFeature();
};
