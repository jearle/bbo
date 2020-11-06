import { startServer } from './server';

const {
  PORT,
  HOST: host,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_NODE,
  RCA_WEB_USERNAME,
  RCA_WEB_PASSWORD,
  RCA_WEB_SERVER,
  REDIS_URI,
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
  username: RCA_WEB_USERNAME,
  password: RCA_WEB_PASSWORD,
  server: RCA_WEB_SERVER,
};

console.log(rcaWebOptions);

startServer({
  port,
  host,
  elasticsearchOptions,
  redisOptions,
  rcaWebOptions,
});
