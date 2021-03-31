import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../../../providers/elasticsearch';
import {
  getElasticHits,
  getTrendsDataFromElasticResponse,
} from 'shared/dist/helpers/elasticsearch/response-builders';
import {
  Geography,
  PropertyType as FilterPropertyType,
  Aggregation,
} from 'shared/dist/helpers/types';
import { cleanTransactionsSearchQuery } from '../../helpers/clean-transactions-search';
import { createTrendSearchQuery } from '../../helpers/queries';
import { createPropertyTypeFilter } from '../../helpers/property-type-filter';
import { CreatePermissionsFilterResult } from '../../../permissions/helpers/elasticsearch/permissions-filter';

import { PropertyTypeService } from '../../../property-type/services/property-type';
// import { PropertyType } from '../../../property-type/types';

type CreateTransactionsSearchServiceInputs = {
  readonly elasticsearchProvider: ElasticsearchProvider;
  readonly propertyTypeService: PropertyTypeService;
};

type TransactionsSearchServiceInputs = {
  readonly elasticsearchClient: ElasticsearchClient;
  readonly propertyTypeService: PropertyTypeService;
};

type TransactionSearchInputs = {
  readonly page?: number;
  readonly limit?: number;
  readonly permissionsFilter?: CreatePermissionsFilterResult;
};

type TransactionSearchForTrendInputs = {
  readonly geographyFilter?: Geography.Filter;
  readonly propertyTypeFilter?: FilterPropertyType.Filter;

  readonly propertyTypes?: string[];

  readonly aggregation?: Aggregation;
  readonly permissionsFilter?: CreatePermissionsFilterResult;
  readonly limit?: number;
};

const { TRANSACTIONS_INDEX } = process.env;

const transactionsSearchService = ({
  elasticsearchClient,
  propertyTypeService,
}: TransactionsSearchServiceInputs) => ({
  async searchTransactions({
    page = 0,
    limit = 10,
    permissionsFilter = null,
  }: TransactionSearchInputs = {}) {
    const esQuery = cleanTransactionsSearchQuery({
      page,
      limit,
      permissionsFilter,
    });
    const result = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      body: esQuery,
    });
    return getElasticHits(result);
  },

  async searchTrends({
    geographyFilter,
    propertyTypes,
    aggregation,
    permissionsFilter,
    limit,
  }: TransactionSearchForTrendInputs = {}) {
    const propertyTypeFilter = await createPropertyTypeFilter({
      propertyTypeService,
      propertyTypes,
    });

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
      data: getTrendsDataFromElasticResponse(
        result,
        aggregation.aggregationType
      ),
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
  propertyTypeService,
}: CreateTransactionsSearchServiceInputs): TransactionsSearchService => {
  const elasticsearchClient = elasticsearchProvider.createClient();

  return transactionsSearchService({
    elasticsearchClient,
    propertyTypeService,
  });
};
