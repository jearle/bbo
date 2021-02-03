import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../../../providers/elasticsearch';

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
  query?: any;
};

const DEFAULT_FILTER = { match_all: {} };
const { TRANSACTIONS_INDEX } = process.env;

const transactionsSearchService = ({
  elasticsearchClient,
}: TransactionsSearchServiceInputs) => ({
  async search({
    query = {},
  }: TransactionSearchInputs = {}) {
    console.log(JSON.stringify(query, null, 2))
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: query
    });
    return result;
  },
});

const transactionsSearchService_v1 = ({
  elasticsearchClient,
}: TransactionsSearchServiceInputs) => ({
  async search({
    page = 0,
    limit = 10,
    filter = DEFAULT_FILTER,
  }: TransactionSearchInputs = {}) {
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
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
