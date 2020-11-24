import * as express from 'express';
import {
  fetchResponseOnRandomPort,
  fetchTextOnRandomPort,
  fetchJSONOnRandomPort,
} from './listen-fetch';

test(`fetchResponseOnRandomPort`, async () => {
  const app = express();
  app.get(`/`, (req, res) => {
    res.send(`pass`);
  });

  const response = await fetchResponseOnRandomPort(app);

  expect(response.status).toBe(200);
});

test(`fetchResponseOnRandomPort with path`, async () => {
  const app = express();
  app.get(`/pass`, (req, res) => {
    res.send(`pass`);
  });

  const response = await fetchResponseOnRandomPort(app, { path: `/pass` });

  expect(response.status).toBe(200);
});

test(`fetchResponseOnRandomPort with query`, async () => {
  const app = express();
  app.get(`/`, (req, res) => {
    res.send(req.query.foo);
  });

  const response = await fetchResponseOnRandomPort(app, { query: `foo=bar` });
  const text = await response.text();

  expect(text).toBe(`bar`);
});

test(`fetchTextOnRandomPort`, async () => {
  const app = express();
  app.get(`/`, (req, res) => {
    res.send(`pass`);
  });

  const text = await fetchTextOnRandomPort(app);

  expect(text).toBe(`pass`);
});

test(`fetchJSONOnRandomPort`, async () => {
  const app = express();
  app.get(`/`, (req, res) => {
    res.json({ pass: `pass` });
  });

  const { pass } = await fetchJSONOnRandomPort(app);

  expect(pass).toBe(`pass`);
});
