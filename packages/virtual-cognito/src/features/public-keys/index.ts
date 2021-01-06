import { createPublicKeysApp } from './apps/public-keys';

const publicKeysFeature = () => ({
  publicKeysApp: createPublicKeysApp,
});

type PublicKeysFeature = ReturnType<typeof publicKeysFeature>;

export const createPublicKeysFeature = (): PublicKeysFeature => {
  return publicKeysFeature();
};
