import { createPermissionsService } from '.';

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

  test(`fetchPermissionModel`, async () => {
    const {
      stateProvidence,
      country,
      marketTier,
      metro,
      transType,
      propertyTypeSearch,
    } = await permissionsService.fetchPermissionModel({
      userId: USER_ID,
    });

    expect(Array.isArray(stateProvidence)).toBe(true);
    expect(Array.isArray(country)).toBe(true);
    expect(Array.isArray(marketTier)).toBe(true);
    expect(Array.isArray(metro)).toBe(true);
    expect(Array.isArray(transType)).toBe(true);
    expect(Array.isArray(propertyTypeSearch)).toBe(true);
  });
});
