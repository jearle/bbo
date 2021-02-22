import { createTransactionsSearchService, TransactionsSearchService } from '.';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { createPermissionsFilter } from '../../../permissions/helpers/elasticsearch/permissions-filter';
import { PermissionsSet } from '../../../permissions/services/rca-web-accounts/permissions-model';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`transactionsSearchService`, () => {
  let transactionsSearchService: TransactionsSearchService;
  const permissionsSet: PermissionsSet = {
    permissionModels: [
      {
        Country: [],
        MarketTier: [],
        Metro: [21], //atlanta
        StateProv: [],
        PropertyTypeSearch: [96], //office
        TransType: [1, 2, 3]
      }
    ]
  };
  const permissionsFilter = createPermissionsFilter({ permissionsSet });
  const atlantaFilter = {
    id: 21,
    type: 6,
    name: 'Atlanta',
  };
  const austinFilter = {
    id: 23,
    type: 6,
    name: 'Austin'
  };

  const officeFilter = {
    propertyTypeId: 96,
    allPropertySubTypes: true,
    propertySubTypeIds: [102, 107],
  };

  beforeAll(() => {
    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });

    transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
    });
  });

  describe(`searchTransactions`, () => {
    test(`searchTransactions`, async () => {
      const result = await transactionsSearchService.searchTransactions();

      expect(result).toHaveLength(10);
    });
    test(`searchTransactions with permissions`, async () => {
      const result = await transactionsSearchService.searchTransactions({
        permissionsFilter
      });

      expect(result).toHaveLength(10);
    });
  });

  describe(`searchTrends`, () => {
    test(`searchTrends returns results`, async () => {
      const results = await transactionsSearchService.searchTrends({
        geographyFilter: atlantaFilter,
        propertyTypeFilter: officeFilter,
        aggregation: { aggregationType: 'PRICE', currency: 'USD' },
      });
      expect(results.data.length).toBeGreaterThan(0);
    });
    test(`searchTrends returns results with permissions`, async () => {
      const results = await transactionsSearchService.searchTrends({
        geographyFilter: atlantaFilter,
        propertyTypeFilter: officeFilter,
        permissionsFilter: permissionsFilter,
        aggregation: { aggregationType: 'PRICE', currency: 'USD' },
      });
      expect(results.data.length).toBeGreaterThan(0);
    });

    test(`searchTrends returns no results without correct permissions`, async () => {
      const results = await transactionsSearchService.searchTrends({
        geographyFilter: austinFilter,
        propertyTypeFilter: officeFilter,
        permissionsFilter: permissionsFilter,
        aggregation: { aggregationType: 'PRICE', currency: 'USD' },
      });
      expect(results.data.length).toBe(0);
    });
  });

});
