import { csvToArray } from '../../helpers/csv';
import { unique } from '../../helpers/array';

export interface PermissionModel {
  readonly stateProvidence: string[];
  readonly country: string[];
  readonly marketTier: string[];
  readonly metro: string[];
  readonly transType: string[];
  readonly propertyTypeSearch: string[];
}

export interface RawPermissionModel {
  readonly StateProv_csv: string | null;
  readonly Country_csv: string | null;
  readonly MarketTier_csv: string | null;
  readonly Metro_csv: string | null;
  readonly TransType_csv: string | null;
  readonly PtsMenu_csv: string | null;
}

const createEmptyPermissionModel = (): PermissionModel => ({
  stateProvidence: [],
  country: [],
  marketTier: [],
  metro: [],
  transType: [],
  propertyTypeSearch: [],
});

const createPermissionModelFromRaw = (
  rawPermissionModel: RawPermissionModel
): PermissionModel => {
  const {
    StateProv_csv,
    Country_csv,
    MarketTier_csv,
    Metro_csv,
    TransType_csv,
    PtsMenu_csv,
  } = rawPermissionModel;

  const permissionModel: PermissionModel = {
    stateProvidence: csvToArray(StateProv_csv),
    country: csvToArray(Country_csv),
    marketTier: csvToArray(MarketTier_csv),
    metro: csvToArray(Metro_csv),
    transType: csvToArray(TransType_csv),
    propertyTypeSearch: csvToArray(PtsMenu_csv),
  };

  return permissionModel;
};

export const createPermissionModelFromListOfRaw = (
  rawPermissionModels: RawPermissionModel[]
) => {
  const permissionModel = rawPermissionModels.reduce(
    (acc, rawPermissionModel) => {
      const {
        stateProvidence,
        country,
        marketTier,
        metro,
        transType,
        propertyTypeSearch,
      } = createPermissionModelFromRaw(rawPermissionModel);

      return {
        stateProvidence: unique([...acc.stateProvidence, ...stateProvidence]),
        country: unique([...acc.country, ...country]),
        marketTier: unique([...acc.marketTier, ...marketTier]),
        metro: unique([...acc.metro, ...metro]),
        transType: unique([...acc.transType, ...transType]),
        propertyTypeSearch: unique([
          ...acc.propertyTypeSearch,
          ...propertyTypeSearch,
        ]),
      };
    },
    createEmptyPermissionModel()
  );

  return permissionModel;
};
