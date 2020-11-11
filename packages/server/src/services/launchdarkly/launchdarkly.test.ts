import * as LaunchDarkly from 'launchdarkly-node-server-sdk';
import MockLDClient from './launchdarkly.mock';

jest.mock('launchdarkly-node-server-sdk', () => {
  return {
    LDClient: jest.fn(),
    init: jest.fn()
  };
});
import { init } from 'launchdarkly-node-server-sdk';
import { createLaunchDarklyClient, fetchLaunchDarklyFlag } from './index';

const mockedInit = init as jest.Mock;

describe('LaunchDarkly Service', () => {
  let consoleErrorSpy, consoleLogSpy;
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { }); // silence errors and can confirm when it's called
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { }); // silence logs
  })
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createLaunchDarklyClient', () => {
    it('should fail to create a client', async () => {
      mockedInit.mockImplementationOnce(() => new MockLDClient(true));
      const client = await createLaunchDarklyClient({ sdkKey: 'test' });
      expect(client).toBeNull();
      expect(consoleErrorSpy).toBeCalledTimes(1);
      expect(mockedInit).toBeCalledTimes(1);
    });

    it('should create a client', async () => {
      mockedInit.mockImplementationOnce(() => new MockLDClient());
      const client = await createLaunchDarklyClient({ sdkKey: 'test' });
      expect(client).not.toBeNull();
      expect(mockedInit).toBeCalledTimes(1);
    });
  });

  describe('fetchLaunchDarklyFlag', () => {
    it('fetches a flag', async () => {
      const mockClient = new MockLDClient();
      const value = await fetchLaunchDarklyFlag({ client: mockClient, flagName: 'foo', defaultValue: 'bar' });
      expect(value).toBe('bar');
    });

    it('catches error and returns default value', async () => {
      const mockClient = new MockLDClient(false, true);
      const value = await fetchLaunchDarklyFlag({ client: mockClient, flagName: 'foo' });
      expect(consoleErrorSpy).toBeCalledTimes(1);
      expect(value).toBe(false);
    });
  });
});
