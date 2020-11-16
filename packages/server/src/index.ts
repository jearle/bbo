import { startServer } from './server';

const {
  PORT,
  HOST: host,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_NODE,
  RCA_WEB_URI,
  REDIS_URI,
  LAUNCH_DARKLY_SDK
} = process.env;

const port = parseInt(PORT);

const elasticsearchOptions = {
  username: ELASTICSEARCH_USERNAME,
  password: ELASTICSEARCH_PASSWORD,
  node: ELASTICSEARCH_NODE,
};

const redisOptions = {
  uri: REDIS_URI,
};

const rcaWebOptions = {
  uri: RCA_WEB_URI,
};

const launchDarklyOptions = {
  sdkKey: LAUNCH_DARKLY_SDK
}

startServer({
  port,
  host,
  elasticsearchOptions,
  redisOptions,
  rcaWebOptions,
  launchDarklyOptions
});
