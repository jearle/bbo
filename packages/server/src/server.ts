import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import logger from './features/logger';

// Helpers
import { useSwaggerDocumentation } from './helpers/swagger/express-mount';

// Middleware
import { loggerMiddleware } from './features/logger/middlewares/logger';
import { loggerIdMiddleware } from './features/logger/middlewares/logger-id';
import { loggerErrorMiddleware } from './features/logger/middlewares/logger-error';
import { authenticationMiddleware } from './middlewares/authentication';
import { permissionsMiddleware } from './middlewares/permissions';

// Services
import {
  ElasticsearchOptions,
  createElasticsearchClient,
} from './services/elasticsearch';
import { createTransactionsService } from './apps/transactions-search/services/transactions';
import { createRcaWebAccountsService, RcaWebAccountsOptions } from './services/rca-web-accounts';
import { createRedisService, RedisOptions } from './services/redis';
import { CognitoOptions, createCognitoService } from './services/cognito';
import { createPermissionsService } from './services/permissions';
import { createAuthenticationService } from './services/authentication';
import {
  createLaunchDarklyClient,
  LaunchDarklyOptions,
} from './services/launchdarkly';

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
  rcaWebAccountsOptions: RcaWebAccountsOptions;
  launchDarklyOptions: LaunchDarklyOptions;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  cognitoOptions,
  elasticsearchOptions,
  rcaWebAccountsOptions,
  redisOptions,
  launchDarklyOptions,
}: ServerOptions) => {
  const elasticSearchClient = createElasticsearchClient(elasticsearchOptions);

  const transactionsService = createTransactionsService({
    client: elasticSearchClient,
  });

  const cognitoService = await createCognitoService(cognitoOptions);
  const authenticationService = createAuthenticationService({ cognitoService });
  const redisService = createRedisService(redisOptions);
  const rcaWebAccountsService = createRcaWebAccountsService(rcaWebAccountsOptions);
  const permissionsService = createPermissionsService({
    redisService,
    rcaWebAccountsService,
  });
  let launchDarklyClient;
  try {
    launchDarklyClient = await createLaunchDarklyClient(launchDarklyOptions);
  } catch (error) {
    launchDarklyClient = null;
  }

  const mounts = express();
  const authenticationApp = createAuthenticationApp({
    authenticationService,
  });
  const transactionsSearchApp = createTransactionsSearchApp({
    transactionsService,
    launchDarklyClient,
  });

  // Pre Middleware
  mounts.use(loggerIdMiddleware());
  mounts.use(loggerMiddleware({ logger }));
  mounts.use(json());

  mounts.use(authenticationBasePath, authenticationApp);

  useSwaggerDocumentation(mounts, {
    host,
    port,
    name: `authentication`,
    basePath: authenticationBasePath,
    description: authenticationDescription,
  });

  mounts.use(
    transactionsSearchBasePath,
    authenticationMiddleware({ authenticationService })
  );
  mounts.use(
    transactionsSearchBasePath,
    permissionsMiddleware({ permissionsService })
  );

  // Apps
  mounts.use(transactionsSearchBasePath, transactionsSearchApp);
  useSwaggerDocumentation(mounts, {
    host,
    port,
    name: `transactions-search`,
    basePath: transactionsSearchBasePath,
    description: transactionsSearchDescription,
  });

  // Post Middleware
  mounts.use(loggerErrorMiddleware({ logger, env: process.env.NODE_ENV }));

  // Start Server
  const server = createServer(mounts);
  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    logger.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};
