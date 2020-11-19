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
