import { createApp, BASE_PATH, DESCRIPTION } from './apps/transactions-search';
import { createElasticsearchProvider } from './providers/elasticsearch';
import {
  createTransactionsSearchService,
  TransactionsSearchService,
} from './services/transactions-search';

export type TransactionsSearchFeatureOptions = {
  readonly node: string;
  readonly username: string;
  readonly password: string;
};

type TransactionsSearchFeatureInputs = {
  readonly transactionsSearchService: TransactionsSearchService;
};

const transactionsSearchFeature = ({
  transactionsSearchService,
}: TransactionsSearchFeatureInputs) => ({
  transactionsSearchBasePath: BASE_PATH,
  transactionsSearchDescription: DESCRIPTION,

  transactionsSearchApp() {
    return createApp({ transactionsSearchService });
  },
});

type TransactionsSearchFeature = ReturnType<typeof transactionsSearchFeature>;

export const createTransactionsSearchFeature = ({
  username,
  password,
  node,
}: TransactionsSearchFeatureOptions): TransactionsSearchFeature => {
  const elasticsearchProvider = createElasticsearchProvider({
    node,
    username,
    password,
  });
  const transactionsSearchService = createTransactionsSearchService({
    elasticsearchProvider,
  });

  return transactionsSearchFeature({ transactionsSearchService });
};
