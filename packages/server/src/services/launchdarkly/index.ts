import * as LaunchDarkly from 'launchdarkly-node-server-sdk';
import logger from '../../logger';

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
    logger.info('LD Client ready');
    return client;
  } catch (err) {
    logger.error(`LD Client initialization failed: ${err}`);
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
    logger.error('error', `error fetching flag ${flagName}: ${err}`);
    return defaultValue;
  }
};

// todo once integrated with auth user / decide which fields we want for each user
/* export const createLDUser = ({ jwt or rcaUser }) => {
  // todo parse jwt or get user
  // cd's launchdarkly user below 
   return {
          key: user.AccountUser_id.toString(),
          firstName: user.FirstName_tx,
          lastName: user.LastName_tx,
          custom: {
            accountId: user.Account_id.toString(),
          }
 }
 */

const _anonUser: LaunchDarkly.LDUser = { 'key': 'anonymous', 'anonymous': true };
