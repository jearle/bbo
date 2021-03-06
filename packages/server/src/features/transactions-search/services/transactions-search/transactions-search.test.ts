import { createTransactionsSearchService, TransactionsSearchService } from '.';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../../../providers/redis';
import { createPermissionsFilter } from '../../../permissions/helpers/elasticsearch/permissions-filter';
import { createPropertyTypeService } from '../../../property-type/services/property-type';
import { PermissionsSet } from '../../../permissions/services/rca-web-accounts/permissions-model';

const {
  REDIS_URI,
  ANALYTICSDATA_MSSQL_URI,
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
        TransType: [1, 2, 3],
      },
    ],
  };
  const permissionsFilter = createPermissionsFilter({ permissionsSet });
  const atlantaFilter = {
    id: 21,
    type: 6,
    name: 'Atlanta',
  };

  beforeAll(async () => {
    const redisProvider = await createRedisProvider({ uri: REDIS_URI });
    const mssqlProvider = await createMSSQLProvider({
      uri: ANALYTICSDATA_MSSQL_URI,
    });
    const propertyTypeService = await createPropertyTypeService({
      mssqlProvider,
      redisProvider,
    });

    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });

    transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
      propertyTypeService,
    });
  });

  describe(`searchTransactions`, () => {
    test(`searchTransactions`, async () => {
      const result = await transactionsSearchService.searchTransactions();

      expect(result).toHaveLength(10);
    });

    test(`searchTransactions with permissions`, async () => {
      const result = await transactionsSearchService.searchTransactions({
        permissionsFilter,
      });

      expect(result).toHaveLength(10);
    });
  });

  describe(`searchTrends`, () => {
    test(`receives results with parent property type`, async () => {
      const { data } = await transactionsSearchService.searchTrends({
        geographyFilter: atlantaFilter,
        propertyTypes: [`office`],
        aggregation: { aggregationType: 'PRICE', currency: 'USD' },
      });

      expect(data.length).toBeGreaterThan(0);
    });

    test(`receives results with sub property type set`, async () => {
      const { data } = await transactionsSearchService.searchTrends({
        geographyFilter: atlantaFilter,
        propertyTypes: [`office-office-cbd`],
        aggregation: { aggregationType: 'PRICE', currency: 'USD' },
      });

      expect(data.length).toBeGreaterThan(0);
    });
  });
});
