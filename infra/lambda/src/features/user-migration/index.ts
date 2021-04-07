import { createFetchDoesAuthenticate } from './services/authenticate';
import { createUserMigrationTrigger } from './triggers/user-migration';

const url = process.env.cdProxyLoginUrl;

if (!url) {
  throw 'Environment variable cdProxyLoginUrl must be defined';
}

const fetchDoesAuthenticate = createFetchDoesAuthenticate({ url });

const userMigrationFeature = () => ({
  userMigrationTrigger: createUserMigrationTrigger({ fetchDoesAuthenticate }),
});

type UserMigrationFeature = ReturnType<typeof userMigrationFeature>;

export const createUserMigrationFeature = (): UserMigrationFeature => {
  return userMigrationFeature();
};
