import { createApp, BASE_PATH } from './apps/healthcheck';
import { createElasticsearchProvider } from '../../providers/elasticsearch';
import { createMSSQLProvider } from '../../providers/mssql';
import {
  createElasticsearchHealthService,
  ElasticsearchHealthService,
} from './services/elasticsearch';
import {
  createRCAWebAccountsHealthService,
  RCAWebAccountsHealthService,
} from './services/rca-web-accounts';

export type HealthCheckFeatureOptions = {
  readonly node: string;
  readonly username: string;
  readonly password: string;
  readonly mssqlURI: string;
};

type HealthCheckFeatureInputs = {
  readonly elasticsearchHealthService: ElasticsearchHealthService;
  readonly rcaWebAccountsHealthService: RCAWebAccountsHealthService;
};

const healtCheckFeature = ({
  elasticsearchHealthService,
  rcaWebAccountsHealthService,
}: HealthCheckFeatureInputs) => ({
  healthCheckBasePath: BASE_PATH,

  healthCheckApp() {
    return createApp({
      elasticsearchHealthService,
      rcaWebAccountsHealthService,
    });
  },
});

export type HealthCheckFeature = ReturnType<typeof healtCheckFeature>;

export const createHealthCheckFeature = async ({
  username,
  password,
  node,
  mssqlURI,
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

  return healtCheckFeature({
    elasticsearchHealthService,
    rcaWebAccountsHealthService,
  });
};
