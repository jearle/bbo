
/* istanbul ignore next */
export const mockLDClient = ({ shouldFailInitialization = false, shouldFailVariation = false }) => ({
  async waitForInitialization(): Promise<any> {
    return shouldFailInitialization ? Promise.reject('failed to initailize') : Promise.resolve('ready');
  },
  close() {
    return true;
  },
  async variation(flagName: string, user: any, defaultValue: any): Promise<any> {
    return shouldFailVariation ? Promise.reject('failed to get variation') : Promise.resolve(defaultValue);
  }
});
