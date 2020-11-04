import * as express from 'express';
import * as fetch from 'node-fetch';
import { useSwaggerDocumentation } from './express-mount';
import { portListen } from '../express/port-listen';
import { getRandomPort } from '../express/random-port';

const createSwaggerServer = async ({ basePath = null } = {}) => {
  const app = express();

  const port = await getRandomPort();

  useSwaggerDocumentation(app, {
    port,
    host: `127.0.0.1`,
    description: `test`,
    ...(basePath === null ? {} : { basePath }),
  });

  const server = await portListen(app, { port });

  return { port, server };
};

test(`useSwaggerDocumentation`, async () => {
  const { port, server } = await createSwaggerServer();

  const response = await fetch(`http://127.0.0.1:${port}/documentation`);
  const text = await response.text();

  expect(text).toMatch(/<title>Swagger UI<\/title>/);

  server.close();
});

test(`useSwaggerDocumentation with basePath`, async () => {
  const { port, server } = await createSwaggerServer({ basePath: `/foo` });

  const response = await fetch(`http://127.0.0.1:${port}/foo/documentation`);
  const text = await response.text();

  expect(text).toMatch(/<title>Swagger UI<\/title>/);

  server.close();
});
