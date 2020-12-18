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

export type HealthCheckFeatureOptions = {
  readonly node: string;
  readonly username: string;
  readonly password: string;
  readonly mssqlURI: string;
  readonly redisURI: string;
};

type HealthCheckFeatureInputs = {
  readonly elasticsearchHealthService: ElasticsearchHealthService;
  readonly rcaWebAccountsHealthService: RCAWebAccountsHealthService;
  readonly redisHealthService: RedisHealthService;
};

const healtCheckFeature = ({
  elasticsearchHealthService,
  rcaWebAccountsHealthService,
  redisHealthService,
}: HealthCheckFeatureInputs) => ({
  healthCheckBasePath: BASE_PATH,

  healthCheckApp() {
    return createApp({
      elasticsearchHealthService,
      rcaWebAccountsHealthService,
      redisHealthService,
    });
  },
});

export type HealthCheckFeature = ReturnType<typeof healtCheckFeature>;

export const createHealthCheckFeature = async ({
  username,
  password,
  node,
  mssqlURI,
  redisURI,
}: HealthCheckFeatureOptions): Promise<HealthCheckFeature> => {
  const elasticsearchProvider = createElasticsearchProvider({
    node,
    username,
    password,
  });
  const elasticsearchHealthService = createElasticsearchHealthService({
    elasticsearchProvider,
  });
  const mssqlProvider = await createMSSQLProvider({ uri: mssqlURI });
  const rcaWebAccountsHealthService = await createRCAWebAccountsHealthService({
    mssqlProvider,
  });
  const createRedisProviderWrapper = async () => {
    return await createRedisProvider({ uri: redisURI });
  };
  const redisHealthService = await createRedisHealthService({
    createRedisProvider: createRedisProviderWrapper,
  });

  return healtCheckFeature({
    elasticsearchHealthService,
    rcaWebAccountsHealthService,
    redisHealthService,
  });
};
