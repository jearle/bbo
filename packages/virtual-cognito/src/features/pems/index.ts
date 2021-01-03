import { createPemsApp } from './apps/pems';

const pemsFeature = () => ({
  pemsApp: createPemsApp,
});

type PemsFeature = ReturnType<typeof pemsFeature>;

export const createPemsFeature = (): PemsFeature => {
  return pemsFeature();
};
