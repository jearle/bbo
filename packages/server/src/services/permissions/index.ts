import {
  PermissionModel,
  RawPermissionModel,
  createPermissionModelFromListOfRaw,
} from './permission-model';

import { RcaWebAccountsService } from '../rca-web-accounts';

interface PermissionsServiceOptions {
  readonly redisService: any;
  readonly rcaWebAccountsService: RcaWebAccountsService;
}

export interface PermissionsService {
  fetchPermissionModel(options: { userId: number }): Promise<any>;
  clearPermissionModel(options: { userId: number }): Promise<void>;
  close(): Promise<any>;
}

const STORED_PROCEDURE = `ReturnStateProvAndCountryPTsByUser_New_PTSMenu`;

const fetchRawPermissionModels = async (
  rcaWebAccountsService: RcaWebAccountsService,
  userId: number
): Promise<RawPermissionModel[]> => {
  const connectionPool = await rcaWebAccountsService.connectionPool();

  const result = await connectionPool
    .request()
    .input(`AccountUser_id`, rcaWebAccountsService.types().Int, userId)
    .execute(STORED_PROCEDURE);

  const [rawPermissionModels]: [RawPermissionModel[]] = result.recordsets;

  return rawPermissionModels;
};

export const createPermissionsService = ({
  redisService,
  rcaWebAccountsService,
}: PermissionsServiceOptions): PermissionsService => {
  return {
    async fetchPermissionModel({ userId }) {
      const cachedPermissionModel = await redisService.get(userId);
      if (cachedPermissionModel) return JSON.parse(cachedPermissionModel);

      const rawPermissionModels = await fetchRawPermissionModels(
        rcaWebAccountsService,
        userId
      );

      const permissionModel = createPermissionModelFromListOfRaw(
        rawPermissionModels
      );

      await redisService.set(userId, JSON.stringify(permissionModel));

      return permissionModel;
    },

    async clearPermissionModel({ userId }) {
      await redisService.del(userId);
    },

    async close() {
      await rcaWebAccountsService.close();
      await redisService.close();
    },
  };
};
