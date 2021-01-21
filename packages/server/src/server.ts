import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import logger, { createLoggerFeature } from './features/logger';

// Features
import { createHealthCheckFeature } from './features/healthcheck';

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
import {
  UserActivityFeatureInputOptions,
  createUserActivityFeature,
} from './features/user-activity';

import { createGeographyFeature } from './features/geography';

interface ServerOptions {
  readonly port?: number;
  readonly host?: string;
  readonly permissionsFeatureOptions: PermissionsFeatureOptions;
  readonly authenticationFeatureOptions: AuthenticationFeatureOptions;
  readonly featureFlagOptions: FeatureFlagOptions;
  readonly transactionsSearchOptions: TransactionsSearchFeatureOptions;
  readonly userActivityFeatureOptions: UserActivityFeatureInputOptions;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  permissionsFeatureOptions,
  authenticationFeatureOptions,
  featureFlagOptions,
  transactionsSearchOptions,
  userActivityFeatureOptions,
}: ServerOptions): Promise<void> => {
  // features
  const {
    loggerIdMiddleware,
    loggerMiddleware,
    loggerErrorMiddleware,
  } = createLoggerFeature();
  const { permissionsMiddleware } = await createPermissionsFeature(
    permissionsFeatureOptions
  );

  const { userActivityMiddleWare } = await createUserActivityFeature(
    userActivityFeatureOptions
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

  const {
    healthCheckApp,
    healthCheckBasePath,
  } = await createHealthCheckFeature({
    createElasticsearchProviderOptions: transactionsSearchOptions,
    createMssqlProviderOptions: permissionsFeatureOptions,
    createRedisProviderOptions: permissionsFeatureOptions,
    createLaunchDarklyProviderOptions: featureFlagOptions,
    createCognitoProviderOptions: authenticationFeatureOptions,
  });

  const {
    transactionsSearchApp,
    transactionsSearchBasePath,
  } = createTransactionsSearchFeature(transactionsSearchOptions);

  const { geographyApp, geographyBasePath } = await createGeographyFeature();

  // end features

  const mounts = express();

  // Pre Middleware
  mounts.use(loggerIdMiddleware());
  mounts.use(loggerMiddleware());
  mounts.use(userActivityMiddleWare());
  mounts.use(json());

  mounts.use(documentationApp());

  mounts.use(healthCheckBasePath, healthCheckApp());

  mounts.use(authenticationBasePath, authenticationApp());

  mounts.use(transactionsSearchBasePath, authenticationMiddleware());
  mounts.use(transactionsSearchBasePath, permissionsMiddleware());

  // Apps
  mounts.use(transactionsSearchBasePath, transactionsSearchApp());
  mounts.use(geographyBasePath, geographyApp());

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
