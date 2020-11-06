import { startServer } from './server';

const {
  PORT,
  HOST: host,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_NODE,
  RCA_WEB_SQL_USER,
  RCA_WEB_SQL_PASSWORD,
  RCA_WEB_SQL_DATABASE,
  RCA_WEB_SQL_SERVER,
  RCA_WEB_SQL_CONNECTIONTIMEOUT,
  RCA_WEB_SQL_MAX,
  RCA_WEB_SQL_MIN,
  RCA_WEB_SQL_IDLETIMEOUTMILLIS
} = process.env;

const port = parseInt(PORT);
const elasticsearchOptions = {
  username: ELASTICSEARCH_USERNAME,
  password: ELASTICSEARCH_PASSWORD,
  node: ELASTICSEARCH_NODE,
};
const rcaWebDbOptions = {
  dbRcaWebAccounts: {
    user: RCA_WEB_SQL_USER,
    password: RCA_WEB_SQL_PASSWORD,
    database: RCA_WEB_SQL_DATABASE,
    server: RCA_WEB_SQL_SERVER,
    connectionTimeout: Number(RCA_WEB_SQL_CONNECTIONTIMEOUT),
    pool: {
      max: Number(RCA_WEB_SQL_MAX),
      min: Number(RCA_WEB_SQL_MIN),
      idleTimeoutMillis: Number(RCA_WEB_SQL_IDLETIMEOUTMILLIS)
    }
  }
}

startServer({ port, host, elasticsearchOptions, rcaWebDbOptions });
