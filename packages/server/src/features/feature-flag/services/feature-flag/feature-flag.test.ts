import { createFeatureFlagService, FeatureFlagService } from '.';
import { createLaunchdarklyProvider } from '../../providers/launchdarkly';

const { LAUNCH_DARKLY_SDK } = process.env;

describe(`FeatureFlagService`, () => {
  let featureFlagService: FeatureFlagService;

  beforeAll(async () => {
    const launchdarklyProvider = await createLaunchdarklyProvider({
      sdkKey: LAUNCH_DARKLY_SDK,
    });

    featureFlagService = await createFeatureFlagService({
      launchdarklyProvider,
    });
  });

  afterAll(async () => {
    await featureFlagService.close();
  });

  test(`fetchFeatureFlag`, async () => {
    const value = await featureFlagService.fetchFeatureFlag({
      flagName: `ff-release-api-27-set-up-launch-darkly`,
    });

    expect(value).not.toBeUndefined();
  });
});
