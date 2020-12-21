import fetch from 'node-fetch';
import * as express from 'express';
import { createApp } from './';
import { portListen } from '../../../../helpers/express/port-listen';

import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../../../providers/redis';
import { createLaunchdarklyProvider } from '../../../../providers/launchdarkly';
import { createCognitoProvider } from '../../../../providers/cognito';

import { createElasticsearchHealthService } from '../../services/elasticsearch';
import { createRCAWebAccountsHealthService } from '../../services/rca-web-accounts';
import { createRedisHealthService } from '../../services/redis';
import { createLaunchDarklyHealthService } from '../../services/launchdarkly';
import { createCognitoHealthService } from '../../services/cognito';

const {
  MSSQL_URI,
  REDIS_URI,
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  LAUNCH_DARKLY_SDK,
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

describe(`transactions app`, () => {
  let server = null;
  let app = null;
  let url = null;
  let healthyApp = null;
  let unhealthyApp = null;

  beforeEach(async () => {
    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });
    const mssqlProvider = await createMSSQLProvider({ uri: MSSQL_URI });
    const createRedisProviderWrapper = async () => {
      return await createRedisProvider({
        uri: REDIS_URI,
      });
    };
    const createLaunchDarklyProviderWrapper = async () => {
      return await createLaunchdarklyProvider({ sdkKey: LAUNCH_DARKLY_SDK });
    };
    const createUnhealthyLaunchDarklyProviderWrapper = async () => {
      return await createLaunchdarklyProvider({ sdkKey: '_WRONG_SDK_KEY_' });
    };
    const createCognitoProviderWrapper = async () => {
      return await createCognitoProvider({
        region: COGNITO_REGION,
        userPoolId: COGNITO_USER_POOL_ID,
        appClientId: COGNITO_APP_CLIENT_ID,
        appClientSecret: COGNITO_APP_CLIENT_SECRET,
      });
    };

    const elasticsearchHealthService = await createElasticsearchHealthService({
      elasticsearchProvider,
    });
    const rcaWebAccountsHealthService = await createRCAWebAccountsHealthService(
      { mssqlProvider }
    );
    const redisHealthService = await createRedisHealthService({
      createRedisProvider: createRedisProviderWrapper,
    });
    const launchDarklyHealthService = await createLaunchDarklyHealthService({
      createLaunchDarklyProvider: createLaunchDarklyProviderWrapper,
    });
    const unhealthyLaunchDarklyHealthService = await createLaunchDarklyHealthService(
      { createLaunchDarklyProvider: createUnhealthyLaunchDarklyProviderWrapper }
    );
    const cognitoHealthService = await createCognitoHealthService({
      createCognitoProvider: createCognitoProviderWrapper,
    });

    app = express();
    healthyApp = createApp({
      elasticsearchHealthService,
      rcaWebAccountsHealthService,
      redisHealthService,
      launchDarklyHealthService,
      cognitoHealthService,
    });
    unhealthyApp = createApp({
      elasticsearchHealthService,
      rcaWebAccountsHealthService,
      redisHealthService,
      launchDarklyHealthService: unhealthyLaunchDarklyHealthService,
      cognitoHealthService,
    });
  });

  afterEach(() => {
    server.close();
  });

  test(`/ping`, async () => {
    app.use(healthyApp);
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    const result = await fetch(`${url}/ping`);
    expect(result.status).toBe(200);
  });

  test(`/healthcheck healthy app`, async () => {
    app.use(healthyApp);
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    const result = await fetch(`${url}/healthcheck`);
    const { status, msg } = await result.json();
    expect(status).toBe(0);
    expect(msg).toBe('ok');
  });

  test(`/healthcheck unhealthy app`, async () => {
    app.use(unhealthyApp);
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    const result = await fetch(`${url}/healthcheck`);
    const { status, msg } = await result.json();
    expect(status).toBe(1);
    expect(msg).toBe('LaunchDarkly Failed;');
  });
});
