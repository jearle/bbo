import { startServer } from './server';

const {
  PORT,
  HOST: host,
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_NODE,
  MSSQL_URI,
  REDIS_URI,
  LAUNCH_DARKLY_SDK,
} = process.env;

const port = parseInt(PORT);

const cognitoOptions = {
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  appClientId: COGNITO_APP_CLIENT_ID,
  appClientSecret: COGNITO_APP_CLIENT_SECRET,
};

const elasticsearchOptions = {
  username: ELASTICSEARCH_USERNAME,
  password: ELASTICSEARCH_PASSWORD,
  node: ELASTICSEARCH_NODE,
};

const launchDarklyOptions = {
  sdkKey: LAUNCH_DARKLY_SDK,
};

const permissionsFeatureOptions = {
  mssqlURI: MSSQL_URI,
  redisURI: REDIS_URI,
};

startServer({
  port,
  host,
  cognitoOptions,
  elasticsearchOptions,
  launchDarklyOptions,
  permissionsFeatureOptions,
});
