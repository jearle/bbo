import { LDClient, LDLogger, init } from 'launchdarkly-node-server-sdk';

export { LDClient as LaunchdarklyProvider } from 'launchdarkly-node-server-sdk';

type CreateLaunchdarkleyProviderInput = {
  readonly sdkKey: string;
  readonly endpoint?: string;
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
  endpoint,
}: CreateLaunchdarkleyProviderInput): Promise<LDClient> => {
  const options = {
    logger,
    baseUri: endpoint ? endpoint : undefined,
    streamUri: endpoint ? endpoint : undefined,
    eventsUri: endpoint ? endpoint : undefined,
  };

  // console.log(options);

  const client = init(sdkKey, options);

  await client.waitForInitialization();

  return client;
};
