import { Application } from 'express';
import { createApp } from './';
import fetch from 'node-fetch';

const waitListen = (app: any): Promise<Application> => {
  const promise = new Promise((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  }) as Promise<Application>;

  return promise;
};

test(`creates company app`, () => {
  const app = createApp();

  expect.any(app);
});

test(`fetches health endpoint`, async () => {
  const app = createApp();

  const server = await waitListen(app);
  const { port } = server.address();

  const response = await fetch(`http://localhost:${port}/health`);
  const json = await response.json();

  expect(json.health).toBe(`ok`);

  server.close();
});
