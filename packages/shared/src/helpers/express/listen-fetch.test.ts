import * as express from 'express';
import { json } from 'body-parser';
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

test(`fetchResponseOnRandomPort with headers`, async () => {
  const app = express();
  app.get(`/`, (req, res) => {
    res.send(req.headers[`x-foo-header`]);
  });

  const response = await fetchResponseOnRandomPort(app, {
    headers: { [`x-foo-header`]: `bar` },
  });
  const text = await response.text();

  expect(text).toBe(`bar`);
});

test(`fetchResponseOnRandomPort with body`, async () => {
  const app = express();
  app.use(json());
  app.post(`/`, (req, res) => {
    res.send(req.body.foo);
  });

  const response = await fetchResponseOnRandomPort(app, {
    headers: {
      [`content-type`]: `application/json`,
    },
    method: `POST`,
    body: JSON.stringify({ foo: `bar` }),
  });
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
