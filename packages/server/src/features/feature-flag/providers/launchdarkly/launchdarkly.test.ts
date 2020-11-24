import { createLaunchdarklyProvider } from '.';

const { LAUNCHDARKLY_SDK } = process.env;

describe(`launchdarklyProvider`, () => {
  test('createLaunchdarklyProvider', async () => {
    const launchdarklyProvider = await createLaunchdarklyProvider({
      sdkKey: LAUNCHDARKLY_SDK,
    });

    launchdarklyProvider.close();
  });
});
