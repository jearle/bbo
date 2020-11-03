import fetch from 'node-fetch';

import { createApp } from './';

import { portListen } from '../../helpers/express/port-listen';

test(`creates company app`, () => {
  const app = createApp();

  expect.any(app);
});

test(`fetches health endpoint`, async () => {
  const app = createApp();

  const server = await portListen(app);
  const { port } = server.address();

  const response = await fetch(`http://localhost:${port}/health`);
  const json = await response.json();

  expect(json.health).toBe(`ok`);

  server.close();
});
