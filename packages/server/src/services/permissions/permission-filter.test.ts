import { createPermissionsService } from '.';
import { createPermissionFilter } from './permission-filter';
import { createRedisService } from '../redis';
import { createRcaWebAccountsService } from '../rca-web-accounts';

const { RCA_WEB_ACCOUNTS_URI, REDIS_URI } = process.env;

const USER_ID = 130435;

describe(`permissions service`, () => {
  jest.setTimeout(20000);

  let permissionsService = null;

  beforeAll(async () => {
    const redisService = createRedisService({ uri: REDIS_URI });
    const rcaWebAccountsService = createRcaWebAccountsService({ uri: RCA_WEB_ACCOUNTS_URI });

    permissionsService = createPermissionsService({
      redisService,
      rcaWebAccountsService,
    });

    // fetch once to ensure caching via test coverage
    await permissionsService.fetchPermissionModel({
      userId: USER_ID,
    });
  });

  afterAll(async () => {
    await permissionsService.clearPermissionModel({ userId: USER_ID });
    await permissionsService.close();
  });

  test(`createPermissionsFilter`, async () => {
    const permissionModel = await permissionsService.fetchPermissionModel({
      userId: USER_ID,
    });

    const permissionFilter = createPermissionFilter({ permissionModel });

    expect(Array.isArray(permissionFilter.bool.must)).toBe(true);
  });
});
