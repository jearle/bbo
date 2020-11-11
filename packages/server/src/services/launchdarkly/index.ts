import * as LaunchDarkly from 'launchdarkly-node-server-sdk';
import MockLDClient from './launchdarkly.mock';

interface LDClientOptions {
  sdkKey: string;
};

export type LDClientType = {
  waitForInitialization();
  variation(flagName: string, user: any, defaultValue: any);
  close();
};

interface FetchLaunchDarklyFlagOptions {
  client: LDClientType;
  flagName: string;
  user?: LaunchDarkly.LDUser;
  defaultValue?: any;
};

export const createLaunchDarklyClient = async ({
  sdkKey
}: LDClientOptions): Promise<LaunchDarkly.LDClient> => {
  const client = LaunchDarkly.init(sdkKey);
  try {
    await client.waitForInitialization();
    console.log('LD Client ready');
    return client;
  } catch (err) {
    console.error(`LD Client initialization failed: ${err}`);
    return null; //todo: throw err or return null?
  }
};

export const fetchLaunchDarklyFlag = async ({
  client,
  flagName,
  user = _anonUser,
  defaultValue = false
}: FetchLaunchDarklyFlagOptions): Promise<any> => {
  try {
    const value = await client.variation(flagName, user, defaultValue);
    return value;
  } catch (err) {
    console.error(err);
    return defaultValue;
  }
};

// export const createLDUser = ({ }) => {

// }

const _anonUser: LaunchDarkly.LDUser = { 'key': 'anonymous', 'anonymous': true };
