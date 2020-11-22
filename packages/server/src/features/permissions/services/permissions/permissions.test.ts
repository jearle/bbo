import { createPermissionsService, PermissionsService } from '.';
import { createMSSQLProvider } from '../../providers/mssql';
import { createRedisProvider } from '../../providers/redis';
import { createRCAWebAccountsService } from '../rca-web-accounts';

const { MSSQL_URI, REDIS_URI } = process.env;

const USER_ID = `130435`;

describe(`PermissionsService`, () => {
  let permissionsService: PermissionsService;

  beforeAll(async () => {
    const mssqlProvider = await createMSSQLProvider({ uri: MSSQL_URI });
    const redisProvider = await createRedisProvider({ uri: REDIS_URI });

    const rcaWebAccountsService = await createRCAWebAccountsService({
      mssqlProvider,
    });

    permissionsService = await createPermissionsService({
      redisProvider,
      rcaWebAccountsService,
    });
  });

  beforeEach(async () => {
    await permissionsService.clearPermissionModel({ userId: USER_ID });
  });

  afterEach(async () => {
    await permissionsService.clearPermissionModel({ userId: USER_ID });
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`createPermissionsService`, async () => {
    const permissionsModel = await permissionsService.fetchPermissionsModel({
      userId: USER_ID,
    });

    // hit again to ensure caching via istanbul code coverage
    await permissionsService.fetchPermissionsModel({
      userId: USER_ID,
    });

    expect(Array.isArray(permissionsModel.stateProvidence)).toBe(true);
  });
});
