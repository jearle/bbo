import { LDClient, LDLogger, init } from 'launchdarkly-node-server-sdk';

export { LDClient as LaunchdarklyProvider } from 'launchdarkly-node-server-sdk';

type CreateLaunchdarkleyProviderInput = {
  readonly sdkKey: string;
  readonly logger?: LDLogger;
};

const EMPTY_LOGGER = {
  error() {
    return;
  },
  warn() {
    return;
  },
  info() {
    return;
  },
  debug() {
    return;
  },
};

export const createLaunchdarklyProvider = async ({
  sdkKey,
  logger = EMPTY_LOGGER,
}: CreateLaunchdarkleyProviderInput): Promise<LDClient> => {
  const client = init(sdkKey, {
    logger,
  });

  await client.waitForInitialization();

  return client;
};
