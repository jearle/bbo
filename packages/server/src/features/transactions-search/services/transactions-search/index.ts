import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../providers/elasticsearch';

type CreateTransactionsSearchServiceInputs = {
  elasticsearchProvider: ElasticsearchProvider;
};

type TransactionsSearchServiceInputs = {
  elasticsearchClient: ElasticsearchClient;
};

type TransactionSearchInputs = {
  page?: number;
  limit?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
};

const DEFAULT_FILTER = { match_all: {} };

const transactionsSearchService = ({
  elasticsearchClient,
}: TransactionsSearchServiceInputs) => ({
  async search({
    page = 0,
    limit = 10,
    filter = DEFAULT_FILTER,
  }: TransactionSearchInputs = {}) {
    const result = await elasticsearchClient.search({
      index: 'test7_multi_pst',
      from: page * limit,
      size: limit,
      body: {
        query: filter,
      },
    });

    const { hits } = result.body.hits;

    const sources = hits.map(({ _source }) => {
      return _source;
    });

    return sources;
  },

  async health() {
    const result = await elasticsearchClient.search({
      index: 'test7_multi_pst',
      from: 0,
      size: 1,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    const { hits } = result.body.hits;

    const status = hits.length === 1 ? 0 : 1;
    const msg =
      hits.length === 1 ? 'ok' : 'TransactionSearchService is unhealthy';

    return { name: 'TransactionSearchService', status, msg };
  },
});

export type TransactionsSearchService = ReturnType<
  typeof transactionsSearchService
>;

export const createTransactionsSearchService = ({
  elasticsearchProvider,
}: CreateTransactionsSearchServiceInputs): TransactionsSearchService => {
  const elasticsearchClient = elasticsearchProvider.createClient();

  return transactionsSearchService({ elasticsearchClient });
};
