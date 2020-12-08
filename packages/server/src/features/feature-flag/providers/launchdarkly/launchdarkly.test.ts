import { createLaunchdarklyProvider } from '.';
const { LAUNCH_DARKLY_SDK } = process.env;

describe(`launchdarklyProvider`, () => {
  test('createLaunchdarkly client initialized', async () => {
    const launchdarklyProvider = await createLaunchdarklyProvider({
      sdkKey: LAUNCH_DARKLY_SDK,
    });

    const isClientInitialized = launchdarklyProvider.initialized();
    expect(isClientInitialized).toBeTruthy();
  });
});