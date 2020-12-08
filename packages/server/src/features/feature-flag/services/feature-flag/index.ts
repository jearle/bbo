import { LaunchdarklyProvider } from '../../providers/launchdarkly';

type CreateFeatureFlagServiceInput = {
  launchdarklyProvider: LaunchdarklyProvider;
};

type FeatureFlagServiceInput = CreateFeatureFlagServiceInput;

type FetchFeatureFlagInput = {
  readonly flagName: string;
  readonly options?: {
    readonly user?: string;
    readonly defaultValue?: boolean;
  };
};

const featureFlagService = ({
  launchdarklyProvider,
}: FeatureFlagServiceInput) => ({
  async fetchFeatureFlag({
    flagName,
    options: { user = `anonymous`, defaultValue = false } = {},
  }: FetchFeatureFlagInput) {
    const launchdarklyUser = { key: user, anonymous: user === `anonymous` };

    const value = await launchdarklyProvider.variation(
      flagName,
      launchdarklyUser,
      defaultValue
    );

    return value;
  },

  async close() {
    await launchdarklyProvider.close();
  },
});

export type FeatureFlagService = ReturnType<typeof featureFlagService>;

export const createFeatureFlagService = ({
  launchdarklyProvider,
}: CreateFeatureFlagServiceInput): FeatureFlagService => {
  return featureFlagService({ launchdarklyProvider });
};