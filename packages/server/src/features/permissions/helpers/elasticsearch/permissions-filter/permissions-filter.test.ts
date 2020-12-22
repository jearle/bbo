import { createPermissionsFilter } from '.';
import {
  createRCAWebAccountsService,
  RCAWebAccountsService,
} from '../../../services/rca-web-accounts';
import { createMSSQLProvider } from '../../../../../providers/mssql';

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
    const permissionsModel = await rcaWebAccountsService.fetchPermissionsModel({
      userId: USER_ID,
    });

    const {
      bool: { must },
    } = createPermissionsFilter({ permissionsModel });

    expect(must.length).toBeGreaterThan(0);
  });
});
