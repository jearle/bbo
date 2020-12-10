import { createApp, BASE_PATH } from './apps/healthcheck';
import { createElasticsearchProvider } from '../transactions-search/providers/elasticsearch';
import {
  createTransactionsSearchService,
  TransactionsSearchService,
} from '../transactions-search/services/transactions-search';
import { TransactionsSearchFeatureOptions } from '../transactions-search';

type HealthCheckFeatureInputs = {
  readonly transactionsSearchService: TransactionsSearchService;
};

const healtCheckFeature = ({
  transactionsSearchService,
}: HealthCheckFeatureInputs) => ({
  healthCheckBasePath: BASE_PATH,

  healthCheckApp() {
    return createApp({ transactionsSearchService });
  },
});

export type HealthCheckFeature = ReturnType<typeof healtCheckFeature>;

export const createHealthCheckFeature = ({
  username,
  password,
  node,
}: TransactionsSearchFeatureOptions): HealthCheckFeature => {
  const elasticsearchProvider = createElasticsearchProvider({
    node,
    username,
    password,
  });
  const transactionsSearchService = createTransactionsSearchService({
    elasticsearchProvider,
  });

  return healtCheckFeature({ transactionsSearchService });
};
