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

      await redisService.set(userId, JSON.stringify(permissionModel));

      return permissionModel;
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
