import { LDClient, LDLogger, init } from 'launchdarkly-node-server-sdk';

export { LDClient as LaunchdarklyProvider } from 'launchdarkly-node-server-sdk';

type CreateLaunchdarkleyProviderInput = {
  readonly sdkKey: string;
  readonly logger?: LDLogger;
};

/* istanbul ignore next */
export const EMPTY_LOGGER = {
  error(): void {
    return;
  },
  warn(): void {
    return;
  },
  info(): void {
    return;
  },
  debug(): void {
    return;
  },
};
/* istanbul ignore next */

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
