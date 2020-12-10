import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import logger from './features/logger';

// Middleware
import { loggerMiddleware } from './features/logger/middlewares/logger';
import { loggerIdMiddleware } from './features/logger/middlewares/logger-id';
import { loggerErrorMiddleware } from './features/logger/middlewares/logger-error';

// Features
import { createPingFeature } from './features/ping';

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
  // createFeatureFlagFeature,
} from './features/feature-flag';

import { createDocumentationFeature } from './features/documentation';

import {
  TransactionsSearchFeatureOptions,
  createTransactionsSearchFeature,
} from './features/transactions-search';

interface ServerOptions {
  readonly port?: number;
  readonly host?: string;
  readonly permissionsFeatureOptions: PermissionsFeatureOptions;
  readonly authenticationFeatureOptions: AuthenticationFeatureOptions;
  readonly featureFlagOptions: FeatureFlagOptions;
  readonly transactionsSearchOptions: TransactionsSearchFeatureOptions;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  permissionsFeatureOptions,
  authenticationFeatureOptions,
  // featureFlagOptions,
  transactionsSearchOptions,
}: ServerOptions): Promise<void> => {
  // features
  const { permissionsMiddleware } = await createPermissionsFeature(
    permissionsFeatureOptions
  );

  const {
    authenticationMiddleware,
    authenticationApp,
    authenticationBasePath,
    // authenticationDescription,
  } = await createAuthenticationFeature(authenticationFeatureOptions);

  // const { featureFlagMiddleware } = await createFeatureFlagFeature(
  //   featureFlagOptions
  // );

  const { documentationApp } = createDocumentationFeature();

  const { pingApp, pingBasePath } = createPingFeature();

  const {
    transactionsSearchApp,
    transactionsSearchBasePath,
  } = createTransactionsSearchFeature(transactionsSearchOptions);

  // end features

  const mounts = express();

  // Pre Middleware
  mounts.use(loggerIdMiddleware());
  mounts.use(loggerMiddleware({ logger }));
  mounts.use(json());

  mounts.use(documentationApp());

  mounts.use(pingBasePath, pingApp());

  mounts.use(authenticationBasePath, authenticationApp());

  mounts.use(transactionsSearchBasePath, authenticationMiddleware());
  mounts.use(transactionsSearchBasePath, permissionsMiddleware());

  // Apps
  mounts.use(transactionsSearchBasePath, transactionsSearchApp());

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
