export const CREDENTIALS = {
  username: `jearle@rcanalytics.com`,
  password: `=Z9-xW%7`,
};

export const COGNITO_CONFIG = {
  region: `us-east-1`,
  userPoolId: `us-east-1_RpMNfhlFg`,
  appClientId: `mumtcb5anrnlemionpqejqf4h`,
  appClientSecret: `872uad71i1lva2vu0s4v81uij6easc4tu52fdlmmfa1nguoucf6`,
};

export const LOCALHOST_COGNITO_CONFIG = {
  ...COGNITO_CONFIG,
  region: `localhost`,
};
