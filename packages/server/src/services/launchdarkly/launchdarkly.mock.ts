
/* istanbul ignore next */
export default class MockLDClient {
  constructor(private _shouldFailInitialization = false, private _shouldFailVariation = false) {

  };
  public async waitForInitialization(): Promise<any> {
    return this._shouldFailInitialization ? Promise.reject('failed to initailize') : Promise.resolve('ready');
  };
  public close() {
    return true;
  };
  public async variation(flagName: string, user: any, defaultValue: any): Promise<any> {
    return this._shouldFailVariation ? Promise.reject('failed to get variation') : Promise.resolve(defaultValue);
  };
};
