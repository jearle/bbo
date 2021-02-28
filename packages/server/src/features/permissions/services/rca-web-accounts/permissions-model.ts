import { csvToIntArray } from 'shared/dist/helpers/csv';

export type PermissionsSet = {
  permissionModels: PermissionsModel[]; // a user can have multilpe subscriptions each with their own combo of geo/propertype permissions
  fullPermissions?: boolean; // if true they are permissioned for all geo and prop types and we can skip the more granular permissions
};

export type PermissionsModel = {
  readonly StateProv: number[];
  readonly Country: number[];
  readonly MarketTier: number[];
  readonly Metro: number[];
  readonly TransType: number[];
  readonly PropertyTypeSearch: number[];
  readonly FullPermissions?: boolean;
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
    StateProv: csvToIntArray(StateProv_csv),
    Country: csvToIntArray(Country_csv),
    MarketTier: csvToIntArray(MarketTier_csv),
    Metro: csvToIntArray(Metro_csv),
    TransType: csvToIntArray(TransType_csv),
    PropertyTypeSearch: csvToIntArray(PtsMenu_csv),
    FullPermissions: FullPermission_fg
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
