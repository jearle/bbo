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

// Services
import {
  ElasticsearchOptions,
  createElasticsearchClient,
} from './services/elasticsearch';
import { createTransactionsService } from './apps/transactions-search/services/transactions';

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
  PermissionsFeatureOptions,
  createPermissionsFeature,
} from './features/permissions';

import {
  AuthenticationFeatureOptions,
  createAuthenticationFeature,
} from './features/authentication';

interface ServerOptions {
  port?: number;
  host?: string;
  elasticsearchOptions: ElasticsearchOptions;
  launchDarklyOptions: LaunchDarklyOptions;
  permissionsFeatureOptions: PermissionsFeatureOptions;
  authenticationFeatureOptions: AuthenticationFeatureOptions;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  elasticsearchOptions,
  launchDarklyOptions,
  permissionsFeatureOptions,
  authenticationFeatureOptions,
}: ServerOptions) => {
  // features
  const { permissionsMiddleware } = await createPermissionsFeature(
    permissionsFeatureOptions
  );

  const {
    authenticationMiddleware,
    authenticationApp,
    authenticationBasePath,
    authenticationDescription,
  } = await createAuthenticationFeature(authenticationFeatureOptions);
  // end features

  const elasticSearchClient = createElasticsearchClient(elasticsearchOptions);

  const transactionsService = createTransactionsService({
    client: elasticSearchClient,
  });

  let launchDarklyClient;
  try {
    launchDarklyClient = await createLaunchDarklyClient(launchDarklyOptions);
  } catch (error) {
    launchDarklyClient = null;
  }

  const mounts = express();
  const transactionsSearchApp = createTransactionsSearchApp({
    transactionsService,
    launchDarklyClient,
  });

  // Pre Middleware
  mounts.use(loggerIdMiddleware());
  mounts.use(loggerMiddleware({ logger }));
  mounts.use(json());

  console.log(authenticationBasePath, authenticationBasePath);
  mounts.use(authenticationBasePath, authenticationApp());

  useSwaggerDocumentation(mounts, {
    host,
    port,
    name: `authentication`,
    basePath: authenticationBasePath,
    description: authenticationDescription,
  });

  mounts.use(transactionsSearchBasePath, authenticationMiddleware());
  mounts.use(transactionsSearchBasePath, permissionsMiddleware());

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
