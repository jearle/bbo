import * as express from 'express';
import { json } from 'body-parser';
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
import { authenticationMiddleware } from './middlewares/authentication';
import { permissionsMiddleware } from './middlewares/permissions';

// Services
import {
  ElasticsearchOptions,
  createElasticsearchClient,
} from './services/elasticsearch';
import { createTransactionsService } from './apps/transactions-search/services/transactions';
import { createRCAWebService, RCAWebOptions } from './services/rca-web';
import { createRedisService, RedisOptions } from './services/redis';
import { CognitoOptions, createCognitoService } from './services/cognito';
import { createPermissionsService } from './services/permissions';
import { createAuthenticationService } from './services/authentication';

// Apps
import {
  createApp as createTransactionsSearchApp,
  BASE_PATH as transactionsSearchBasePath,
  DESCRIPTION as transactionsSearchDescription,
} from './apps/transactions-search';

import {
  createApp as createAuthenticationApp,
  BASE_PATH as authenticationBasePath,
  DESCRIPTION as authenticationDescription,
} from './apps/authentication';

interface ServerOptions {
  port?: number;
  host?: string;
  cognitoOptions: CognitoOptions;
  elasticsearchOptions: ElasticsearchOptions;
  redisOptions: RedisOptions;
  rcaWebOptions: RCAWebOptions;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  cognitoOptions,
  elasticsearchOptions,
  rcaWebOptions,
  redisOptions,
}: ServerOptions) => {
  const elasticSearchClient = createElasticsearchClient(elasticsearchOptions);

  const transactionsService = createTransactionsService({
    client: elasticSearchClient,
  });

  const cognitoService = await createCognitoService(cognitoOptions);
  const authenticationService = createAuthenticationService({ cognitoService });
  const redisService = createRedisService(redisOptions);
  const rcaWebService = createRCAWebService(rcaWebOptions);
  const permissionsService = createPermissionsService({
    redisService,
    rcaWebService,
  });

  const mounts = express();
  const authenticationApp = createAuthenticationApp({
    authenticationService,
  });
  const transactionsSearchApp = createTransactionsSearchApp({
    transactionsService,
  });

  // Pre Middleware
  mounts.use(loggerIdMiddlewware());
  mounts.use(loggerMiddleware());
  mounts.use(json());

  mounts.use(authenticationBasePath, authenticationApp);

  mounts.use(authenticationMiddleware({ authenticationService }));
  mounts.use(permissionsMiddleware({ permissionsService }));

  // Apps
  mounts.use(transactionsSearchBasePath, transactionsSearchApp);
  useSwaggerDocumentation(mounts, {
    host,
    port,
    basePath: transactionsSearchBasePath,
    description: transactionsSearchDescription,
  });

  // Post Middleware
  mounts.use(loggerErrorMiddleware());

  // Start Server
  const server = createServer(mounts);
  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    logger.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};
