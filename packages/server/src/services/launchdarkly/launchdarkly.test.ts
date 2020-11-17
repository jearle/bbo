import * as LaunchDarkly from 'launchdarkly-node-server-sdk';
import { mockLDClient } from './launchdarkly.mock';

jest.mock('launchdarkly-node-server-sdk', () => {
  return {
    init: jest.fn()
  };
});
import { init } from 'launchdarkly-node-server-sdk';
import { createLaunchDarklyClient, fetchLaunchDarklyFlag } from './index';
import logger from '../../logger';

const mockedInit = init as jest.Mock;

describe('LaunchDarkly Service', () => {
  let logErrorSpy, infoLogSpy;
  beforeEach(() => {
    logErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => null); // silence errors and can confirm when it's called
    infoLogSpy = jest.spyOn(logger, 'info').mockImplementation(() => null); // silence logs
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createLaunchDarklyClient', () => {
    it('should fail to create a client', async () => {
      mockedInit.mockImplementationOnce(() => mockLDClient({ shouldFailInitialization: true }));
      const client = await createLaunchDarklyClient({ sdkKey: 'test' });
      expect(client).toBeNull();
      expect(logErrorSpy).toBeCalledTimes(1);
      expect(mockedInit).toBeCalledTimes(1);
    });

    it('should create a client', async () => {
      mockedInit.mockImplementationOnce(() => mockLDClient({}));
      const client = await createLaunchDarklyClient({ sdkKey: 'test' });
      expect(client).not.toBeNull();
      expect(mockedInit).toBeCalledTimes(1);
    });
  });

  describe('fetchLaunchDarklyFlag', () => {
    it('fetches a flag', async () => {
      const mockClient = mockLDClient({});
      const value = await fetchLaunchDarklyFlag({ client: mockClient, flagName: 'foo', defaultValue: 'bar' });
      expect(value).toBe('bar');
    });

    it('catches error and returns default value', async () => {
      const mockClient = mockLDClient({ shouldFailInitialization: false, shouldFailVariation: true });
      const value = await fetchLaunchDarklyFlag({ client: mockClient, flagName: 'foo' });
      expect(logErrorSpy).toBeCalledTimes(1);
      expect(value).toBe(false);
    });
  });
});
