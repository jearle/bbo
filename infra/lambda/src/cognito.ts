import { createUserMigrationFeature } from './features/user-migration';
// export const preAuthentication = async (event: any): Promise<any> => {
//   console.log('Cognito PreAuthentication Trigger...');

//   return Promise.resolve();
// };

// type Request = {
//   readonly password: string;
// };

// type Event = {
//   readonly username: string;
//   readonly triggerSource:
//     | `UserMigration_Authentication`
//     | `UserMigration_ForgotPassword`;
//   readonly request: Request;
// };

// type Context = {
//   readonly succeed: (event: Event) => void;
// }

// type Callback = (error: String) => void;

// export const userMigration = async (event: Event, context: Context, callback: Callback): Promise<any> => {
//   console.log('Cognito UserMigration Trigger...');

//   return Promise.resolve();
// };

const { userMigrationTrigger } = createUserMigrationFeature();

export const userMigration = userMigrationTrigger;
