import * as express from 'express';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import logger, {
  loggerIdMiddlewware,
  loggerMiddleware,
  loggerErrorMiddleware,
} from './logger';

// Helpers
import { useSwaggerDocumentation } from './helpers/swagger/express-mount';

// Middleware
import { checkUserPermissionModel as authorizationMiddleware } from './middlewares/authorization/index';

// Services
import {
  ElasticsearchOptions,
  createElasticsearchClient,
} from './services/elasticsearch';
import { createTransactionsService } from './apps/transactions-search/services/transactions';
import { createRCAWebDB, SqlOptions } from './services/databases/rcaweb/';
import { createRedisClient, Options as RedisOptions } from './services/redis/index';

// Apps
import {
  createApp as createCompanyApp,
  BASE_PATH as companyBasePath,
  DESCRIPTION as companyDescription,
} from './apps/company';

import {
  createApp as createTransactionsSearchApp,
  BASE_PATH as transactionsSearchBasePath,
  DESCRIPTION as transactionsSearchDescription,
} from './apps/transactions-search';

interface ServerOptions {
  port?: number;
  host?: string;
  elasticsearchOptions: ElasticsearchOptions;
  rcaWebDbOptions: SqlOptions,
  redisOptions: RedisOptions
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  elasticsearchOptions,
  rcaWebDbOptions,
  redisOptions
}: ServerOptions) => {
  const elasticSearchClient = createElasticsearchClient(elasticsearchOptions);

  const transactionsService = createTransactionsService({
    client: elasticSearchClient,
  });

  const rcaWebDbClient = createRCAWebDB(rcaWebDbOptions);

  const redisClient = createRedisClient(redisOptions);

  const mounts = express();

  const companyApp = createCompanyApp();
  const transactionsSearchApp = createTransactionsSearchApp({
    transactionsService,
  });

  mounts.use(loggerIdMiddlewware());
  mounts.use(loggerMiddleware());
  mounts.use(authorizationMiddleware(rcaWebDbClient, redisClient))
  mounts.use(companyBasePath, companyApp);
  useSwaggerDocumentation(mounts, {
    host,
    port,
    basePath: companyBasePath,
    description: companyDescription,
  });

  mounts.use(transactionsSearchBasePath, transactionsSearchApp);
  useSwaggerDocumentation(mounts, {
    host,
    port,
    basePath: transactionsSearchBasePath,
    description: transactionsSearchDescription,
  });

  mounts.use(loggerErrorMiddleware());

  const server = createServer(mounts);

  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    logger.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};
