import * as express from 'express';
import { portListen } from './port-listen';

test(`portListen`, async () => {
  const app = express();

  const server = await portListen(app);
  const { port } = server.address();

  expect(typeof port).toBe(`number`);

  server.close();
});
