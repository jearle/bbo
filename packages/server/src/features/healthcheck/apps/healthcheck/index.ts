import * as express from 'express';
import { Application } from 'express';

export const VERSION = `v0`;
export const DESCRIPTION = `Ping`;
export const BASE_PATH = `/api/healthcheck/${VERSION}`;

export const createApp = (): Application => {
  const app = express();

  app.get(`/ping`, async (req, res) => {
    res.sendStatus(200);
  });

  app.get(`/healthcheck`, async (req, res) => {
    res.json({ description: DESCRIPTION, health: `ok`, version: VERSION });
  });

  return app;
};
