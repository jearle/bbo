import { RCAWebService } from '../rca-web';

interface PermissionsServiceOptions {
  redisService: any;
  rcaWebService: RCAWebService;
}

export interface PermissionsService {
  fetchPermissionModel: Function;
  clearPermissionModel: Function;
  close: Function;
}

const storedProcedure = `ReturnStateProvAndCountryPTsByUser_New_PTSMenu`;

const createPermissionModelRow = (permissionModelRow) => {
  const {
    StateProv_csv,
    Country_csv,
    MarketTier_csv,
    Metro_csv,
    TransType_csv,
    PtsMenu_csv,
  } = permissionModelRow;

  return {
    stateProvidence: StateProv_csv ? StateProv_csv.split(`,`) : [],
    country: Country_csv ? Country_csv.split(`,`) : [],
    marketTier: MarketTier_csv ? MarketTier_csv.split(`,`) : [],
    metro: Metro_csv ? Metro_csv.split(`,`) : [],
    transType: TransType_csv ? TransType_csv.split(`,`) : [],
    propertyTypeSearch: PtsMenu_csv ? PtsMenu_csv.split(`,`) : [],
  };
};

const cleanPermissionModel = (permissionModel) => {
  const cleanedPermissionModel = permissionModel.reduce(
    (acc, rawPermissionModelRow) => {
      const {
        stateProvidence,
        country,
        marketTier,
        metro,
        transType,
        propertyTypeSearch,
      } = createPermissionModelRow(rawPermissionModelRow);

      return {
        stateProvidence: [
          ...new Set([...stateProvidence, ...acc.stateProvidence]),
        ],
        country: [...new Set([...country, ...acc.country])],
        marketTier: [...new Set([...marketTier, ...acc.marketTier])],
        metro: [...new Set([...metro, ...acc.metro])],
        transType: [...new Set([...transType, ...acc.transType])],
        propertyTypeSearch: [
          ...new Set([...propertyTypeSearch, ...acc.propertyTypeSearch]),
        ],
      };
    },
    {
      stateProvidence: [],
      country: [],
      marketTier: [],
      metro: [],
      transType: [],
      propertyTypeSearch: [],
    }
  );

  return cleanedPermissionModel;
};

export const createPermissionsService = ({
  redisService,
  rcaWebService,
}: PermissionsServiceOptions): PermissionsService => {
  return {
    async fetchPermissionModel({ userId }) {
      const cachedPermissionModel = await redisService.get(userId);

      if (cachedPermissionModel) return JSON.parse(cachedPermissionModel);

      const connectionPool = await rcaWebService.connectionPool();

      const result = await connectionPool
        .request()
        .input(`AccountUser_id`, rcaWebService.types().Int, userId)
        .execute(storedProcedure);

      const [permissionModel] = result.recordsets;

      const cleanedPermissionModel = cleanPermissionModel(permissionModel);

      await redisService.set(userId, JSON.stringify(cleanedPermissionModel));

      return cleanedPermissionModel;
    },

    async clearPermissionModel({ userId }) {
      await redisService.del(userId);
    },

    async close() {
      await rcaWebService.close();
      await redisService.close();
    },
  };
};
