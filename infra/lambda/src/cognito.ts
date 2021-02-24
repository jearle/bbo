import { createUserMigrationFeature } from './features/user-migration';

const { userMigrationTrigger } = createUserMigrationFeature();

export const userMigration = userMigrationTrigger;
