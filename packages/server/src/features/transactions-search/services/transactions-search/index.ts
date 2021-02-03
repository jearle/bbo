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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: any;
  responseHandler?: (results: Record<string, any>) => any
};

const DEFAULT_SEARCH = {
  query: {
    bool: {
      must: {
        match_all: {}
      }
    }
  }
};
const { TRANSACTIONS_INDEX } = process.env;

const transactionsSearchService = ({
  elasticsearchClient,
}: TransactionsSearchServiceInputs) => ({
  async search({
    query = DEFAULT_SEARCH,
    responseHandler = transactionsSearchResults
  }: TransactionSearchInputs = {}) {

    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: query
    });
    return responseHandler(result);
  },
});

const transactionsSearchResults = (results: Record<string, any>) => {
  const { hits } = results.body.hits;
  return hits.map(({ _source }) => {
    return _source;
  });
};


export type TransactionsSearchService = ReturnType<
  typeof transactionsSearchService
>;

export const createTransactionsSearchService = ({
  elasticsearchProvider,
}: CreateTransactionsSearchServiceInputs): TransactionsSearchService => {
  const elasticsearchClient = elasticsearchProvider.createClient();

  return transactionsSearchService({ elasticsearchClient });
};
