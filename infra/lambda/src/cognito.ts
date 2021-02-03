export const preAuthentication = async (event: any): Promise<any> => {
  console.log('Cognito PreAuthentication Trigger...');

  return Promise.resolve();
};

export const userMigration = async (event: any): Promise<any> => {
  console.log('Cognito UserMigration Trigger...');

  return Promise.resolve();
};
