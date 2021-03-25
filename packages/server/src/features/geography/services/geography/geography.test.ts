import { createGeographyService, GeographyService } from '.';
import { createMSSQLProvider } from '../../../../providers/mssql';

const { ANALYTICSDATA_MSSQL_URI: uri } = process.env;

describe('GeographyService', () => {
  let geographyService: GeographyService;

  beforeAll(async () => {
    const mssqlProvider = createMSSQLProvider({ uri });
    geographyService = await createGeographyService({ mssqlProvider });
  });

  afterAll(async () => {
    await geographyService.close();
  });

  test('fetchGeographies', async () => {
    const result = await geographyService.fetchGeographies();

    expect(result).not.toBeUndefined();
  });
});
