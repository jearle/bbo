import * as express from 'express';
import { Application } from 'express';

export const DIAGNOSTIC_BASE_URI = `/diagnostic`;

export const createDiagnosticApp = (): Application => {
  const app = express();

  app.get(`/healthcheck`, (req, res) => {
    res.send(`ok`);
  });

  app.post(`/`, (req, res) => {
    Object.entries({
      date: new Date().toUTCString(),
      [`content-type`]: `application/json`,
      [`strict-transport-security`]: `max-age=31536000`,
    }).forEach(([key, value]) => {
      res.set(key, value);
    });

    res.status(202);
    res.send();
  });

  return app;
};
