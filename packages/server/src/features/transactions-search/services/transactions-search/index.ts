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
import { CreatePermissionsFilterResult } from '../../../permissions/helpers/elasticsearch/permissions-filter';

type CreateTransactionsSearchServiceInputs = {
  elasticsearchProvider: ElasticsearchProvider;
};

type TransactionsSearchServiceInputs = {
  elasticsearchClient: ElasticsearchClient;
};

type TransactionSearchInputs = {
  page?: number;
  limit?: number;
  query?: unknown;
  permissionsFilter?: CreatePermissionsFilterResult;
};

type TransactionSearchForTrendInputs = {
  geographyFilter?: Geography.Filter;
  propertyTypeFilter?: PropertyType.Filter;
  aggregation?: Aggregation;
  permissionsFilter?: CreatePermissionsFilterResult;
  limit?: number;
};

const DEFAULT_SEARCH = {
  page: 0,
  limit: 10
};
const { TRANSACTIONS_INDEX } = process.env;

const transactionsSearchService = ({
  elasticsearchClient,
}: TransactionsSearchServiceInputs) => ({
  async searchTransactions({ query = DEFAULT_SEARCH, permissionsFilter = null }: TransactionSearchInputs = {}) {
    const esQuery = cleanTransactionsSearchQuery({ ...query, permissionsFilter });
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: esQuery,
    });
    return getElasticHits(result);
  },

  async searchTrends({
    geographyFilter,
    propertyTypeFilter,
    aggregation,
    permissionsFilter,
    limit,
  }: TransactionSearchForTrendInputs = {}) {
    const esQuery = createTrendSearchQuery({
      geographyFilter,
      propertyTypeFilter,
      aggregation,
      permissionsFilter,
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
      response: result.body,
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
