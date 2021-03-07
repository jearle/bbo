import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import * as cors from 'cors';

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

import {
  GeographyFeatureOptions,
  createGeographyFeature,
} from './features/geography';

import {
  createPropertyTypeFeature,
  PropertyTypeFeatureOptions,
} from './features/property-type';

interface ServerOptions {
  readonly port?: number;
  readonly host?: string;
  readonly permissionsFeatureOptions: PermissionsFeatureOptions;
  readonly authenticationFeatureOptions: AuthenticationFeatureOptions;
  readonly featureFlagOptions: FeatureFlagOptions;
  readonly transactionsSearchOptions: TransactionsSearchFeatureOptions;
  readonly userActivityFeatureOptions: UserActivityFeatureInputOptions;
  readonly geographyFeatureOptions: GeographyFeatureOptions;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
  permissionsFeatureOptions,
  authenticationFeatureOptions,
  featureFlagOptions,
  transactionsSearchOptions,
  userActivityFeatureOptions,
  geographyFeatureOptions,
}: ServerOptions): Promise<void> => {
  // features
  const {
    loggerIdMiddleware,
    loggerMiddleware,
    loggerErrorMiddleware,
  } = createLoggerFeature();
  const {
    permissionsMiddleware,
    permissionsApp,
    permissionsBasePath,
  } = await createPermissionsFeature(permissionsFeatureOptions);

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
    createAnalyticsDataMssqlProviderOptions: geographyFeatureOptions,
  });

  const {
    transactionsSearchApp,
    transactionsSearchBasePath,
  } = createTransactionsSearchFeature(transactionsSearchOptions);

  const { geographyApp, geographyBasePath } = await createGeographyFeature(
    geographyFeatureOptions
  );

  const propertyTypeFeatureOptions: PropertyTypeFeatureOptions = geographyFeatureOptions;
  const {
    propertyTypeApp,
    propertyTypeBasePath,
  } = await createPropertyTypeFeature(propertyTypeFeatureOptions);

  // end features

  const mounts = express();

  mounts.use(cors({
    origin: true,
    methods: ['GET', 'POST'],
    alowedHeaders: ['Content-Type', 'accessToken']
  }))

  // Pre Middleware
  mounts.use(loggerIdMiddleware());
  mounts.use(loggerMiddleware());
  mounts.use(userActivityMiddleWare());
  mounts.use(json());

  mounts.use(documentationApp());

  mounts.use(healthCheckBasePath, healthCheckApp());
  mounts.use(permissionsBasePath, permissionsApp());

  mounts.use(authenticationBasePath, authenticationApp());

  mounts.use(transactionsSearchBasePath, authenticationMiddleware());
  mounts.use(transactionsSearchBasePath, permissionsMiddleware());
  mounts.use(geographyBasePath, authenticationMiddleware());
  mounts.use(propertyTypeBasePath, authenticationMiddleware());

  // Apps
  mounts.use(transactionsSearchBasePath, transactionsSearchApp());
  mounts.use(geographyBasePath, geographyApp());
  mounts.use(propertyTypeBasePath, propertyTypeApp());

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
