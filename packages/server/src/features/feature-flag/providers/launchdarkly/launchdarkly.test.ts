import { createLaunchdarklyProvider } from '.';

const { LAUNCH_DARKLY_SDK } = process.env;

describe(`launchdarklyProvider`, () => {
  test('createLaunchdarklyProvider', async () => {
    const launchdarklyProvider = await createLaunchdarklyProvider({
      sdkKey: LAUNCH_DARKLY_SDK,
    });

    launchdarklyProvider.close();
  });
});
