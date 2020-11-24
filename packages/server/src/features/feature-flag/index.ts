import { createLaunchdarklyProvider } from './providers/launchdarkly';
import {
  createFeatureFlagService,
  FeatureFlagService,
} from './services/feature-flag';
import { featureFlagMiddleware } from './middlewares/feature-flag';

import logger from '../logger';

type CreateFeatureFlagInput = {
  readonly sdkKey: string;
};

type FeatureFlagFeatureInput = {
  readonly featureFlagService: FeatureFlagService;
};

export type FeatureFlagOptions = CreateFeatureFlagInput;

const featureFlagFeature = ({
  featureFlagService,
}: FeatureFlagFeatureInput) => ({
  featureFlagMiddleware() {
    return featureFlagMiddleware({ featureFlagService });
  },
});

export const createFeatureFlagFeature = async ({
  sdkKey,
}: CreateFeatureFlagInput) => {
  const launchdarklyProvider = await createLaunchdarklyProvider({
    sdkKey,
    logger,
  });
  const featureFlagService = await createFeatureFlagService({
    launchdarklyProvider,
  });

  return featureFlagFeature({ featureFlagService });
};
