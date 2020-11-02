import { Application } from 'express';
import { createCompanyApp } from './';
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
  const app = createCompanyApp();

  expect.any(app);
});

test(`fetches health endpoint`, async () => {
  const app = createCompanyApp();

  const server = await waitListen(app);
  const { port } = server.address();

  const response = await fetch(`http://localhost:${port}/health`);
  const json = await response.json();

  expect(json.health).toBe(`ok`);

  server.close();
});
