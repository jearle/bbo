import { createUserStore, UserStore } from './store';

export { UserStore } from './store';

type UserStoreFeatureInput = {
  readonly userStore: UserStore;
};

const userStoreFeature = ({ userStore }: UserStoreFeatureInput) => ({
  userStore,
});

export type UserStoreFeature = ReturnType<typeof userStoreFeature>;

export const createUserStoreFeature = (): UserStoreFeature => {
  const userStore = createUserStore();

  return userStoreFeature({ userStore });
};
