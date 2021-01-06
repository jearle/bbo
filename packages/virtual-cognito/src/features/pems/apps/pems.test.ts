import { fetchJSONOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';
import { createPemsApp } from './pems';

describe(`createPemsApp`, () => {
  test(`should return a public key`, async () => {
    const app = createPemsApp();

    const json = await fetchJSONOnRandomPort(app, { path: `/jwks.json` });

    const keys = Object.keys(json);

    expect(keys).toHaveLength(1);

    keys.forEach((key) => {
      const value = json[key];

      expect(key.length).toBeGreaterThan(0);
      expect(value.length).toBeGreaterThan(0);
    });
  });
});
