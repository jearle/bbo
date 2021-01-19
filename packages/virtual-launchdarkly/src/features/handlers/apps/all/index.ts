import * as express from 'express';
import { Application } from 'express';
import { getAllDataResponse } from './responses';

export const ALL_BASE_URI = `/all`;

const getHeaders = () => ({
  date: new Date().toUTCString(),
  [`content-type`]: `text/event-stream; charset=utf-8`,
  [`transfer-encoding`]: `chunked`,
  connection: `close`,
  [`accept-ranges`]: `bytes`,
  [`cache-control`]: `no-cache, no-store, must-revalidate`,
  [`ld-region`]: `us-east-1`,
  [`strict-transport-security`]: `max-age=31536000, max-age=31536000`,
});

export const createAllApp = (): Application => {
  const app = express();

  app.get(`/healthcheck`, (req, res) => {
    res.send(`ok`);
  });

  app.get(`/`, (req, res) => {
    Object.entries(getHeaders()).forEach(([key, value]) => {
      res.set(key, value);
    });

    const response = getAllDataResponse();

    res.write(response);
    res.status(200);
    res.end();
  });

  return app;
};
