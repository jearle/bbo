import { createPropertyTypeService, PropertyTypeService } from '.';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../../../providers/redis';

const { ANALYTICSDATA_MSSQL_URI: uri, REDIS_URI} = process.env;

describe('PropertyTypeService', () => {
  let propertyTypeService: PropertyTypeService;

  beforeAll(async () => {
    const mssqlProvider = createMSSQLProvider({ uri });
    const redisProvider = await createRedisProvider({ uri: REDIS_URI });
    propertyTypeService = await createPropertyTypeService({ mssqlProvider, redisProvider });
  });

  beforeEach(async () => {
    await propertyTypeService.clearCachedPropertyTypeMenu();
  });

  afterEach(async () => {
    await propertyTypeService.clearCachedPropertyTypeMenu();
  });


  afterAll(async () => {
    await propertyTypeService.close();
  });

  test('fetchPropertyTypesMenu', async () => {
    const result = await propertyTypeService.fetchPropertyTypesMenu();
    expect(result).not.toBeUndefined();
  });

  test(`fetchPermissionsModel ensure cache works`, async () => {
    await propertyTypeService.fetchPropertyTypesMenu();

    // hit again to ensure caching via istanbul code coverage
    await propertyTypeService.fetchPropertyTypesMenu();
  });

});
