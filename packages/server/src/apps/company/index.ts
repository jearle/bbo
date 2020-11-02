import * as express from 'express';

export const VERSION = `0.0.0`;

export const createCompanyApp = () => {
  const app = express();

  app.get(`/health`, (req, res) =>
    res.json({ title: `Company API`, health: `ok`, version: VERSION })
  );

  return app;
};
