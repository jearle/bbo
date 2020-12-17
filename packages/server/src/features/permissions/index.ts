import { createPermissionsService } from './services/permissions';
import { createMSSQLProvider } from '../../providers/mssql';
import { createRedisProvider } from './providers/redis';
import { createRCAWebAccountsService } from './services/rca-web-accounts';
import { permissionsMiddleware } from './middlewares/permissions';

type CreatePermissionsFeatureInput = {
  readonly mssqlURI: string;
  readonly redisURI: string;
};

export type PermissionsFeatureOptions = CreatePermissionsFeatureInput;

const permissionsFeature = ({ permissionsService }) => ({
  permissionsMiddleware() {
    return permissionsMiddleware({ permissionsService });
  },
});

export type PermissionsFeature = ReturnType<typeof permissionsFeature>;

export const createPermissionsFeature = async ({
  mssqlURI,
  redisURI,
}: CreatePermissionsFeatureInput): Promise<PermissionsFeature> => {
  const mssqlProvider = await createMSSQLProvider({ uri: mssqlURI });
  const redisProvider = await createRedisProvider({ uri: redisURI });

  const rcaWebAccountsService = await createRCAWebAccountsService({
    mssqlProvider,
  });

  const permissionsService = await createPermissionsService({
    redisProvider,
    rcaWebAccountsService,
  });

  return permissionsFeature({ permissionsService });
};
