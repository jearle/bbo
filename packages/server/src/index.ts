import { startServer } from './server';

const {
  PORT,
  HOST: host,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_NODE,
  RCA_WEB_USER,
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
  user: RCA_WEB_USER,
  password: RCA_WEB_PASSWORD,
  server: RCA_WEB_SERVER,
};

startServer({
  port,
  host,
  elasticsearchOptions,
  redisOptions,
  rcaWebOptions,
});
