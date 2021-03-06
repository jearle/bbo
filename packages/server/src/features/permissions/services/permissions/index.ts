import { RCAWebAccountsService } from '../rca-web-accounts';
import { PermissionsSet } from '../rca-web-accounts/permissions-model';

type PermissionsServiceInput = {
  readonly redisProvider;
  readonly rcaWebAccountsService: RCAWebAccountsService;
};

type FetchPermissionsModelInput = {
  readonly userId?: string;
  readonly username?: string;
};

type ClearCachedPermissionsModelInput = {
  readonly userId: string;
};

type CheckCacheForPermissionsModelInput = {
  readonly redisProvider;
  readonly userId: string;
};

type UpdateCacheWithPermissionsModelInput = {
  readonly redisProvider;
  readonly userId: string;
  readonly permissionsModel;
};

type FetchUserIdInput = {
  readonly redisProvider;
  readonly rcaWebAccountsService: RCAWebAccountsService;
  readonly username: string;
};

type ClearCachedUserIdInput = {
  readonly username: string;
};

type CheckCacheForUserIdInput = {
  readonly redisProvider;
  readonly username: string;
};

type UpdateCacheWithUserIdInput = {
  readonly redisProvider;
  readonly username: string;
  readonly userId: string;
};

type CreatePermissionsServiceInput = PermissionsServiceInput;

const checkCacheForPermissionsModel = async ({
  redisProvider,
  userId,
}: CheckCacheForPermissionsModelInput) => {
  const cachedPermissionsModel = await redisProvider.get(userId);
  if (cachedPermissionsModel) return JSON.parse(cachedPermissionsModel);
  return null;
};

const updateCacheWithPermissionsModel = async ({
  redisProvider,
  userId,
  permissionsModel,
}: UpdateCacheWithPermissionsModelInput) => {
  await redisProvider.set(userId, JSON.stringify(permissionsModel));
};

const checkCacheForUserId = async ({
  redisProvider,
  username,
}: CheckCacheForUserIdInput) => {
  const cachedUserId = await redisProvider.get(username);

  if (cachedUserId) return cachedUserId;

  return null;
};

const updateCacheWithUserId = async ({
  redisProvider,
  username,
  userId,
}: UpdateCacheWithUserIdInput) => {
  await redisProvider.set(username, userId);
};

const fetchUserId = async ({
  redisProvider,
  rcaWebAccountsService,
  username,
}: FetchUserIdInput) => {
  const cachedUserId = await checkCacheForUserId({
    redisProvider,
    username,
  });
  if (cachedUserId) return cachedUserId;

  const userId = await rcaWebAccountsService.fetchUserId({ username });

  await updateCacheWithUserId({
    redisProvider,
    username,
    userId,
  });

  return userId;
};

const permissionsService = ({
  redisProvider,
  rcaWebAccountsService,
}: PermissionsServiceInput) => ({
  async fetchPermissionsSet({
    userId: userIdInput,
    username,
  }: FetchPermissionsModelInput): Promise<PermissionsSet> {
    const userId = username
      ? await fetchUserId({ redisProvider, rcaWebAccountsService, username })
      : userIdInput;

    const cachedPermissionsModel = await checkCacheForPermissionsModel({
      redisProvider,
      userId,
    });

    if (cachedPermissionsModel) return cachedPermissionsModel;

    const permissionsModel = await rcaWebAccountsService.fetchPermissionsModel({
      userId,
    });

    await updateCacheWithPermissionsModel({
      redisProvider,
      userId,
      permissionsModel,
    });

    return permissionsModel;
  },

  async clearCachedUserId({ username }: ClearCachedUserIdInput) {
    await redisProvider.del(username);
  },

  async clearCachedPermissionsModel({
    userId,
  }: ClearCachedPermissionsModelInput) {
    await redisProvider.del(userId);
  },

  async close() {
    await redisProvider.close();
    await rcaWebAccountsService.close();
  },
});

export type PermissionsService = ReturnType<typeof permissionsService>;

export const createPermissionsService = ({
  redisProvider,
  rcaWebAccountsService,
}: CreatePermissionsServiceInput): PermissionsService => {
  return permissionsService({ redisProvider, rcaWebAccountsService });
};
