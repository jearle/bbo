import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import logger from './features/logger';

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

// Apps
import {
  createApp as createTransactionsSearchApp,
  BASE_PATH as transactionsSearchBasePath,
} from './apps/transactions-search';

import {
  PermissionsFeatureOptions,
  createPermissionsFeature,
} from './features/permissions';

import {
  AuthenticationFeatureOptions,
  createAuthenticationFeature,
} from './features/authentication';

import {
  FeatureFlagOptions,
  createFeatureFlagFeature,
} from './features/feature-flag';

import { createDocumentationFeature } from './features/documentation';

interface ServerOptions {
  readonly port?: number;
  readonly host?: string;
  readonly elasticsearchOptions: ElasticsearchOptions;
  readonly permissionsFeatureOptions: PermissionsFeatureOptions;
  readonly authenticationFeatureOptions: AuthenticationFeatureOptions;
  readonly featureFlagOptions: FeatureFlagOptions;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  elasticsearchOptions,
  permissionsFeatureOptions,
  authenticationFeatureOptions,
  featureFlagOptions,
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

  const { featureFlagMiddleware } = await createFeatureFlagFeature(
    featureFlagOptions
  );

  const { documentationApp } = createDocumentationFeature();

  // end features

  const elasticSearchClient = createElasticsearchClient(elasticsearchOptions);

  const transactionsService = createTransactionsService({
    client: elasticSearchClient,
  });

  const mounts = express();
  const transactionsSearchApp = createTransactionsSearchApp({
    transactionsService,
  });

  // Pre Middleware
  mounts.use(loggerIdMiddleware());
  mounts.use(loggerMiddleware({ logger }));
  mounts.use(json());

  mounts.use(documentationApp());

  mounts.use(authenticationBasePath, authenticationApp());

  mounts.use(transactionsSearchBasePath, authenticationMiddleware());
  mounts.use(transactionsSearchBasePath, permissionsMiddleware());
  mounts.use(
    `${transactionsSearchBasePath}/feature-flag`,
    featureFlagMiddleware()
  );

  // Apps
  mounts.use(transactionsSearchBasePath, transactionsSearchApp);

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
