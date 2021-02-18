import { createPermissionsFilter } from '.';
import {
  createRCAWebAccountsService,
  RCAWebAccountsService,
} from '../../../services/rca-web-accounts';
import { createMSSQLProvider } from '../../../../../providers/mssql';
import { PermissionsSet } from '../../../services/rca-web-accounts/permissions-model';

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
    const permissionsSet = await rcaWebAccountsService.fetchPermissionsModel({
      userId: USER_ID,
    });

    const {
      bool: { should },
    } = createPermissionsFilter({ permissionsSet });
    expect(should.length).toBeGreaterThan(0);
  });

  test(`createPermissionsFilter returns null for full permissions`, () => {
    const permissionsSet: PermissionsSet = {
      fullPermissions: true,
      permissionModels: []
    };
    expect(createPermissionsFilter({ permissionsSet })).toBe(null);
  });

  test(`createPermissionsFilter returns null if no geo permissions`, () => {
    const permissionsSet: PermissionsSet = {
      fullPermissions: false,
      permissionModels: []
    };
    expect(createPermissionsFilter({ permissionsSet })).toBe(null);
  });

  test(`createPermissionsFilter returns a single must filter for user with only one geo`, () => {
    const permissionsSet: PermissionsSet = {
      fullPermissions: false,
      permissionModels: [
        {
          StateProv: [],
          Country: [],
          MarketTier: [],
          Metro: [99],
          TransType: [1],
          PropertyTypeSearch: [1]
        }
      ]
    }
    const permissionsFilter = createPermissionsFilter({ permissionsSet });
    expect(permissionsFilter.bool).not.toBeNull();
  });

  test(`createPermissionsFilter returns a single must filter when user has propertyType but no geoPermissions`, () => {
    const permissionsSet: PermissionsSet = {
      fullPermissions: false,
      permissionModels: [
        {
          StateProv: [],
          Country: [],
          MarketTier: [],
          Metro: [],
          TransType: [],
          PropertyTypeSearch: [1]
        }
      ]
    }
    const permissionsFilter = createPermissionsFilter({ permissionsSet });
    expect(permissionsFilter.bool).not.toBeNull();
  });

});
