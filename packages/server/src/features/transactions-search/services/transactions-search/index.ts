import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../../../providers/elasticsearch';
import {
  getElasticBucket,
  getElasticHits,
} from 'shared/dist/helpers/elasticsearch/response-builders';
import {
  Geography,
  PropertyType,
  Aggregation,
} from 'shared/dist/helpers/types';
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
  geographyFilter?: Geography.Filter;
  propertyTypeFilter?: PropertyType.Filter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aggregation?: Aggregation;
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
  async search({ query = DEFAULT_SEARCH }: TransactionSearchInputs = {}) {
    const esQuery = cleanTransactionsSearchQuery(query);
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: esQuery,
    });
    return getElasticHits(result);
  },

  async getTrends({
    geographyFilter,
    propertyTypeFilter,
    aggregation,
    limit,
  }: TransactionSearchForTrendInputs = {}) {
    const esQuery = createTrendSearchQuery({
      geographyFilter,
      propertyTypeFilter,
      aggregation,
      limit,
    });
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: esQuery,
    });
    return {
      data: getElasticBucket(result),
      index: TRANSACTIONS_INDEX,
      request: esQuery,
      response: result,
    };
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
