import { userMigrationTrigger } from './triggers/user-migration';

const userMigrationFeature = () => ({
  userMigrationTrigger,
});

type UserMigrationFeature = ReturnType<typeof userMigrationFeature>;

export const createUserMigrationFeature = (): UserMigrationFeature => {
  return userMigrationFeature();
};
