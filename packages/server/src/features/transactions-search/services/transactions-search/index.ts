import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../../../providers/elasticsearch';
import { getElasticBucket, getElasticHits } from 'shared/dist/helpers/elasticsearch/response-builders';
import { Filter as GeographyFilter } from 'shared/dist/helpers/types/geography';
import { Aggregation } from 'shared/dist/helpers/types/aggregations';
import { cleanTransactionsSearchQuery } from '../../helpers/clean-transactions-search';
import { createTrendSearchQuery } from '../../helpers/queries';

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
  query?: any;
};

type TransactionSearchForTrendInputs = {
  geographyFilter?: GeographyFilter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aggregation?: Aggregation,
  limit?: number;
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
    query = DEFAULT_SEARCH,
  }: TransactionSearchInputs = {}) {
    const esQuery = cleanTransactionsSearchQuery(query);
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: esQuery,
    });
    return getElasticHits(result);
  },

  async getTrends({
    geographyFilter,
    aggregation,
    limit,
  }: TransactionSearchForTrendInputs = {}) {
    const esQuery = createTrendSearchQuery({
      geographyFilter,
      aggregation,
      limit,
    });
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: esQuery,
    });
    return getElasticBucket(result);
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
