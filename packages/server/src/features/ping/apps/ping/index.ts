import * as express from 'express';
import { Application } from 'express';

export const VERSION = `v0`;
export const DESCRIPTION = `Ping`;
export const BASE_PATH = `/api/ping/${VERSION}`;

export const createApp = (): Application => {
  const app = express();

  app.get(`/`, async (req, res) => {
    res.sendStatus(200);
  });

  return app;
};
