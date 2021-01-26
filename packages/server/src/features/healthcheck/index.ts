import { createApp, BASE_PATH } from './apps/healthcheck';
import { createElasticsearchProvider } from '../../providers/elasticsearch';
import { createMSSQLProvider } from '../../providers/mssql';
import { createRedisProvider } from '../../providers/redis';
import {
  createElasticsearchHealthService,
  ElasticsearchHealthService,
} from './services/elasticsearch';
import {
  createRCAWebAccountsHealthService,
  RCAWebAccountsHealthService,
} from './services/rca-web-accounts';
import { createRedisHealthService, RedisHealthService } from './services/redis';
import {
  createLaunchDarklyHealthService,
  LaunchDarklyHealthService,
} from './services/launchdarkly';
import { createLaunchdarklyProvider } from '../../providers/launchdarkly';
import {
  CognitoHealthService,
  createCognitoHealthService,
} from './services/cognito';
import { createCognitoProvider } from '../../providers/cognito';
import {
  createRCAAnalyticsDataHealthService,
  RCAAnalyticsDataHealthService,
} from './services/rca-analytics-data';

type CreateElasticsearchProviderOptions = {
  readonly node: string;
  readonly username: string;
  readonly password: string;
};

type CreateMssqlProviderOptions = {
  readonly mssqlURI: string;
};

type CreateRedisProviderOptions = {
  readonly redisURI: string;
};

type CreateLaunchDarklyProviderOptions = {
  readonly sdkKey: string;
};

type CreateCognitoProviderOptions = {
  readonly region: string;
  readonly userPoolId: string;
  readonly appClientId: string;
  readonly appClientSecret: string;
};

type CreateAnalyticsDataMssqlProviderOptions = {
  readonly mssqlURI: string;
};

export type HealthCheckFeatureOptions = {
  readonly createElasticsearchProviderOptions: CreateElasticsearchProviderOptions;
  readonly createMssqlProviderOptions: CreateMssqlProviderOptions;
  readonly createRedisProviderOptions: CreateRedisProviderOptions;
  readonly createLaunchDarklyProviderOptions: CreateLaunchDarklyProviderOptions;
  readonly createCognitoProviderOptions: CreateCognitoProviderOptions;
  readonly createAnalyticsDataMssqlProviderOptions: CreateAnalyticsDataMssqlProviderOptions;
};

type HealthCheckFeatureInputs = {
  readonly elasticsearchHealthService: ElasticsearchHealthService;
  readonly rcaWebAccountsHealthService: RCAWebAccountsHealthService;
  readonly redisHealthService: RedisHealthService;
  readonly launchDarklyHealthService: LaunchDarklyHealthService;
  readonly cognitoHealthService: CognitoHealthService;
  readonly rcaAnalyticsDataHealthService: RCAAnalyticsDataHealthService;
};

const healtCheckFeature = ({
  elasticsearchHealthService,
  rcaWebAccountsHealthService,
  redisHealthService,
  launchDarklyHealthService,
  cognitoHealthService,
  rcaAnalyticsDataHealthService,
}: HealthCheckFeatureInputs) => ({
  healthCheckBasePath: BASE_PATH,

  healthCheckApp() {
    return createApp({
      elasticsearchHealthService,
      rcaWebAccountsHealthService,
      redisHealthService,
      launchDarklyHealthService,
      cognitoHealthService,
      rcaAnalyticsDataHealthService,
    });
  },
});

export type HealthCheckFeature = ReturnType<typeof healtCheckFeature>;

export const createHealthCheckFeature = async ({
  createElasticsearchProviderOptions,
  createMssqlProviderOptions,
  createRedisProviderOptions,
  createLaunchDarklyProviderOptions,
  createCognitoProviderOptions,
  createAnalyticsDataMssqlProviderOptions,
}: HealthCheckFeatureOptions): Promise<HealthCheckFeature> => {
  const elasticsearchProvider = createElasticsearchProvider(
    createElasticsearchProviderOptions
  );
  const elasticsearchHealthService = createElasticsearchHealthService({
    elasticsearchProvider,
  });
  const mssqlProvider = await createMSSQLProvider({
    uri: createMssqlProviderOptions.mssqlURI,
  });
  const rcaWebAccountsHealthService = await createRCAWebAccountsHealthService({
    mssqlProvider,
  });
  const createRedisProviderWrapper = async () => {
    return await createRedisProvider({
      uri: createRedisProviderOptions.redisURI,
    });
  };
  const redisHealthService = await createRedisHealthService({
    createRedisProvider: createRedisProviderWrapper,
  });
  const createLaunchDarklyProviderWrapper = async () => {
    return await createLaunchdarklyProvider(createLaunchDarklyProviderOptions);
  };
  const launchDarklyHealthService = await createLaunchDarklyHealthService({
    createLaunchDarklyProvider: createLaunchDarklyProviderWrapper,
  });
  const createCognitoProviderWrapper = async () => {
    return await createCognitoProvider(createCognitoProviderOptions);
  };
  const cognitoHealthService = await createCognitoHealthService({
    createCognitoProvider: createCognitoProviderWrapper,
  });
  const analyticsDataMssqlProvider = await createMSSQLProvider({
    uri: createAnalyticsDataMssqlProviderOptions.mssqlURI,
  });
  const rcaAnalyticsDataHealthService = await createRCAAnalyticsDataHealthService(
    {
      mssqlProvider: analyticsDataMssqlProvider,
    }
  );

  return healtCheckFeature({
    elasticsearchHealthService,
    rcaWebAccountsHealthService,
    redisHealthService,
    launchDarklyHealthService,
    cognitoHealthService,
    rcaAnalyticsDataHealthService,
  });
};
