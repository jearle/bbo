import { RequestListener } from 'http';
import * as express from 'express';

export const VERSION = `0.0.0`;

export const createApp = (): RequestListener => {
  const app = express();

  app.get(`/health`, (req, res) =>
    res.json({ health: `ok`, version: VERSION })
  );

  app.get(`/error`, (req, res) => {
    console.log(`/ERROR API CALLED`);
    res.status(501);
    throw new Error(`hello`);
    res.json({ health: `not ok`, version: VERSION });
  });

  return app;
};
