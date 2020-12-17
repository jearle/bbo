import { createPermissionsService, PermissionsService } from '.';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../providers/redis';
import { createRCAWebAccountsService } from '../rca-web-accounts';

const { MSSQL_URI, REDIS_URI } = process.env;

const USER_ID = `130435`;
const USERNAME = 'jearle@rcanalytics.com';

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
    await permissionsService.clearCachedUserId({ username: USERNAME });
    await permissionsService.clearCachedPermissionsModel({ userId: USER_ID });
  });

  afterEach(async () => {
    await permissionsService.clearCachedUserId({ username: USERNAME });
    await permissionsService.clearCachedPermissionsModel({ userId: USER_ID });
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`fetchPermissionsModel`, async () => {
    const permissionsModel = await permissionsService.fetchPermissionsModel({
      userId: USER_ID,
    });

    expect(Array.isArray(permissionsModel.stateProvidence)).toBe(true);
  });

  test(`fetchPermissionsModel with username`, async () => {
    const permissionsModel = await permissionsService.fetchPermissionsModel({
      username: USERNAME,
    });

    expect(Array.isArray(permissionsModel.stateProvidence)).toBe(true);
  });

  test(`fetchPermissionsModel ensure cache works with userId`, async () => {
    await permissionsService.fetchPermissionsModel({
      userId: USER_ID,
    });

    // hit again to ensure caching via istanbul code coverage
    await permissionsService.fetchPermissionsModel({
      userId: USER_ID,
    });
  });

  test(`fetchPermissionsModel ensure cache works with username`, async () => {
    await permissionsService.fetchPermissionsModel({
      username: USERNAME,
    });

    // hit again to ensure caching via istanbul code coverage
    await permissionsService.fetchPermissionsModel({
      username: USERNAME,
    });
  });
});
