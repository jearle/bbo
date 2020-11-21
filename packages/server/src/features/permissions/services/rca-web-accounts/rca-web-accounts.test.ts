import { createRCAWebAccountsService, RCAWebAccountsService } from '.';
import { createMSSQLProvider } from '../../providers/mssql';

const { MSSQL_URI: uri } = process.env;

const USER_ID = `130435`;

describe(`RCAWebAccountsService`, () => {
  let rcaWebAccountsService: RCAWebAccountsService;

  beforeAll(async () => {
    const mssqlProvider = createMSSQLProvider({ uri });
    rcaWebAccountsService = await createRCAWebAccountsService({
      mssqlProvider,
    });
  });

  afterAll(async () => {
    await rcaWebAccountsService.close();
  });

  test(`fetchPermissionsModel`, async () => {
    const result = await rcaWebAccountsService.fetchPermissionsModel({
      userId: USER_ID,
    });

    expect(result).not.toBeUndefined();
  });
});
