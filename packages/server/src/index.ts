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
  LAUNCHDARKLY_SDK,
  LAUNCHDARKLY_ENDPOINT,
  SEGMENT_ACCESS_KEY,
} = process.env;

const port = parseInt(PORT);

const featureFlagOptions = {
  sdkKey: LAUNCHDARKLY_SDK,
  endpoint: LAUNCHDARKLY_ENDPOINT,
};

const permissionsFeatureOptions = {
  mssqlURI: MSSQL_URI,
  redisURI: REDIS_URI,
};

const authenticationFeatureOptions = {
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  appClientId: COGNITO_APP_CLIENT_ID,
  appClientSecret: COGNITO_APP_CLIENT_SECRET,
};

const transactionsSearchOptions = {
  node: ELASTICSEARCH_NODE,
  username: ELASTICSEARCH_USERNAME,
  password: ELASTICSEARCH_PASSWORD,
};

const userActivityFeatureOptions = {
  accessKey: SEGMENT_ACCESS_KEY,
};

startServer({
  port,
  host,
  permissionsFeatureOptions,
  authenticationFeatureOptions,
  featureFlagOptions,
  transactionsSearchOptions,
  userActivityFeatureOptions,
});
