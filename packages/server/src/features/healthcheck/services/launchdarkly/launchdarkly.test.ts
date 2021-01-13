import { createLaunchdarklyProvider } from '../../../../providers/launchdarkly';
import { createLaunchDarklyHealthService } from './';

const { LAUNCHDARKLY_SDK } = process.env;

test('healthy launch darkly health service', async () => {
  const healthService = await createLaunchDarklyHealthService({
    createLaunchDarklyProvider: async () =>
      await createLaunchdarklyProvider({
        sdkKey: LAUNCHDARKLY_SDK,
      }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(0);
});

test('launch darkly provider is not inizialized', async () => {
  const healthService = await createLaunchDarklyHealthService({
    createLaunchDarklyProvider: async () => ({
      initialized: jest.fn().mockReturnValue(false),
      close: jest.fn(),
    }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});

test('unhealthy launch darkly health service', async () => {
  const healthService = await createLaunchDarklyHealthService({
    createLaunchDarklyProvider: async () => {
      throw new Error();
    },
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});
