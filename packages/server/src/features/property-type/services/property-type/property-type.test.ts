import { createPropertyTypeService, PropertyTypeService } from '.';
import { createMSSQLProvider } from '../../../../providers/mssql';

const { ANALYTICSDATA_MSSQL_URI: uri } = process.env;

describe('PropertyTypeService', () => {
  let propertyTypeService: PropertyTypeService;

  beforeAll(async () => {
    const mssqlProvider = createMSSQLProvider({ uri });
    propertyTypeService = await createPropertyTypeService({ mssqlProvider });
  });

  afterAll(async () => {
    await propertyTypeService.close();
  });

  test('fetchPropertyTypesMenu', async () => {
    const result = await propertyTypeService.fetchPropertyTypesMenu();
    expect(result).not.toBeUndefined();
  });
});
