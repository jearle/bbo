import { csvToIntArray } from 'shared/dist/helpers/csv';
import { unique } from 'shared/dist/helpers/array';
import { map, filter } from 'lodash';

export type PermissionsSet = {
  permissionModels: PermissionsModel[]; // a user can have multilpe subscriptions each with their own combo of geo/propertype permissions
  fullPermissions?: boolean; // if true they are permissioned for all geo and prop types and we can skip the more granular permissions
};

export type PermissionsModel = {
  readonly stateProvidence: number[];
  readonly country: number[];
  readonly marketTier: number[];
  readonly metro: number[];
  readonly transType: number[];
  readonly propertyTypeSearch: number[];
};

export type RawPermissionsModel = {
  readonly StateProv_csv: string | null;
  readonly Country_csv: string | null;
  readonly MarketTier_csv: string | null;
  readonly Metro_csv: string | null;
  readonly TransType_csv: string | null;
  readonly PtsMenu_csv: string | null;
  readonly FullPermission_fg: boolean | null;
};

const createPermissionModelFromRaw = (
  rawPermissionModel: RawPermissionsModel
): PermissionsModel => {
  const {
    StateProv_csv,
    Country_csv,
    MarketTier_csv,
    Metro_csv,
    TransType_csv,
    PtsMenu_csv,
    FullPermission_fg
  } = rawPermissionModel;

  const permissionModel = {
    stateProvidence: csvToIntArray(StateProv_csv),
    country: csvToIntArray(Country_csv),
    marketTier: csvToIntArray(MarketTier_csv),
    metro: csvToIntArray(Metro_csv),
    transType: csvToIntArray(TransType_csv),
    propertyTypeSearch: csvToIntArray(PtsMenu_csv),
    fullPermissions: FullPermission_fg
  };

  return permissionModel;
};

export const createPermissionsModelFromList = (
  rawPermissionModels: RawPermissionsModel[]
): PermissionsSet => {
  let hasFullPermissions = false;
  const permissions = rawPermissionModels.map((rawPermissionModel) => {
    hasFullPermissions = rawPermissionModel.FullPermission_fg || hasFullPermissions; // if any subscription has FullPermission_fg = true, set to true
    return createPermissionModelFromRaw(rawPermissionModel);
  });

  return {
    permissionModels: permissions,
    fullPermissions: hasFullPermissions
  };
};
