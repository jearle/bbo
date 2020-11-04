import { startServer } from './server';

const {
  PORT,
  HOST: host,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_NODE,
} = process.env;

const port = parseInt(PORT);
const elasticsearchOptions = {
  username: ELASTICSEARCH_USERNAME,
  password: ELASTICSEARCH_PASSWORD,
  node: ELASTICSEARCH_NODE,
};

startServer({ port, host, elasticsearchOptions });
