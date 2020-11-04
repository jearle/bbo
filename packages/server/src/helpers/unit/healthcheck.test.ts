import * as express from 'express';
import { testHealthcheck } from './healthcheck';

test(`testHealthcheck`, async () => {
  const app = express();

  app.get(`/healthcheck`, (req, res) => res.json({ health: `ok` }));

  await testHealthcheck(app);
});
