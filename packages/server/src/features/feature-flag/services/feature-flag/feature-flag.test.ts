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
      options: {
        defaultValue: true,
      },
    });

    expect(value).toBeFalsy();
  });

  test(`Smoketest, featureFlag service can return a true flag correctly`, async () => {
    const value = await featureFlagService.fetchFeatureFlag({
      flagName: `ff-debug-test-true`,
    });

    expect(value).toBeTruthy();
  });

  test(`Smoketest, featureFlag service can return a false flag correctly`, async () => {
    const value = await featureFlagService.fetchFeatureFlag({
      flagName: `ff-debug-test-false`,
      options: {
        defaultValue: true,
      },
    });

    expect(value).toBeFalsy();
  });
});
