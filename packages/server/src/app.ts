import { RequestListener } from 'http';
import * as express from 'express';

export const VERSION = `0.0.1`;

export const createApp = (): RequestListener => {
  const app = express();

  app.get(`/health`, (req, res) =>
    res.json({ health: `ok`, version: VERSION })
  );

  return app;
};
