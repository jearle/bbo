import { createPermissionsService } from '.';
import { createPermissionFilter } from './permissions-filter';
import { createRedisService } from '../redis';
import { createRCAWebService } from '../rca-web';

const { RCA_WEB_URI, REDIS_URI } = process.env;

const USER_ID = 130435;

describe(`permissions service`, () => {
  jest.setTimeout(20000);

  let permissionsService = null;

  beforeAll(async () => {
    const redisService = createRedisService({ uri: REDIS_URI });
    const rcaWebService = createRCAWebService({ uri: RCA_WEB_URI });

    permissionsService = createPermissionsService({
      redisService,
      rcaWebService,
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
