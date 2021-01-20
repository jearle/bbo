import { createLaunchdarklyProvider } from '../../providers/launchdarkly';
import {
  createFeatureFlagService,
  FeatureFlagService,
} from './services/feature-flag';
import { featureFlagMiddleware } from './middlewares/feature-flag';

import logger from '../logger';

type CreateFeatureFlagInput = {
  readonly sdkKey: string;
  readonly endpoint?: string;
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

export type FeatureFlagFeature = ReturnType<typeof featureFlagFeature>;

export const createFeatureFlagFeature = async ({
  sdkKey,
  endpoint,
}: CreateFeatureFlagInput): Promise<FeatureFlagFeature> => {
  const launchdarklyProvider = await createLaunchdarklyProvider({
    sdkKey,
    endpoint,
    logger,
  });
  const featureFlagService = await createFeatureFlagService({
    launchdarklyProvider,
  });

  return featureFlagFeature({ featureFlagService });
};
