import { createLaunchdarklyProvider } from '.';
const { LAUNCHDARKLY_SDK } = process.env;

describe(`launchdarklyProvider`, () => {
  test('createLaunchdarkly client initialized', async () => {
    const launchdarklyProvider = await createLaunchdarklyProvider({
      sdkKey: LAUNCHDARKLY_SDK,
    });

    const isClientInitialized = launchdarklyProvider.initialized();
    expect(isClientInitialized).toBeTruthy();
  });
});
