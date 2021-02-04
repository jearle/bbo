import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../../../providers/elasticsearch';
import { ElasticQuery, EsClientRawResponse } from 'shared/dist/helpers/types/elasticsearch';
import { getElasticHits } from 'shared/dist/helpers/elasticsearch/response-builders';

type CreateTransactionsSearchServiceInputs = {
  elasticsearchProvider: ElasticsearchProvider;
};

type TransactionsSearchServiceInputs = {
  elasticsearchClient: ElasticsearchClient;
};

type TransactionSearchInputs = {
  esQuery?: ElasticQuery;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseHandler?: (results: EsClientRawResponse) => any;
};

const DEFAULT_SEARCH = {
  query: {
    bool: {
      must: {
        match_all: {},
      },
    },
  },
};
const { TRANSACTIONS_INDEX } = process.env;

const transactionsSearchService = ({
  elasticsearchClient,
}: TransactionsSearchServiceInputs) => ({
  async search({
    esQuery = DEFAULT_SEARCH,
    responseHandler = getElasticHits,
  }: TransactionSearchInputs = {}) {
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: esQuery,
    });
    return responseHandler(result);
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
