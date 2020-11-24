import { LDClient, init } from 'launchdarkly-node-server-sdk';

export { LDClient as LaunchdarklyProvider } from 'launchdarkly-node-server-sdk';

type CreateLaunchdarkleyProviderInput = {
  readonly sdkKey: string;
};

export const createLaunchdarklyProvider = async ({
  sdkKey,
}: CreateLaunchdarkleyProviderInput): Promise<LDClient> => {
  const client = init(sdkKey);
  await client.waitForInitialization();

  return client;
};
