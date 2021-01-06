import { fetchJSONOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';
import { createPublicKeysApp } from './public-keys';

describe(`createPublicKeysApp`, () => {
  test(`should return a public key`, async () => {
    const app = createPublicKeysApp();

    const json = await fetchJSONOnRandomPort(app, { path: `/user-pool-id` });

    const keys = Object.keys(json);

    expect(keys).toHaveLength(1);

    keys.forEach((key) => {
      const value = json[key];

      expect(key.length).toBeGreaterThan(0);
      expect(value.length).toBeGreaterThan(0);
    });
  });
});
