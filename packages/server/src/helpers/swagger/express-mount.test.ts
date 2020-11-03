import * as express from 'express';
import * as fetch from 'node-fetch';
import { useSwaggerDocumentation } from './express-mount';
import { portListen } from '../express/port-listen';
import { getRandomPort } from '../express/random-port';

test(`useSwaggerDocumentation`, async () => {
  const app = express();

  const port = await getRandomPort();

  useSwaggerDocumentation(app, {
    port,
    host: `127.0.0.1`,
    basePath: `/`,
    description: `test`,
  });

  const server = await portListen(app, { port });

  const response = await fetch(`http://127.0.0.1:${port}/documentation`);
  const text = await response.text();

  expect(text).toMatch(/<title>Swagger UI<\/title>/);

  server.close();
});
