import * as express from 'express';
import { getRandomPort } from './random-port';

test(`getRandomPort`, async () => {
  const port = await getRandomPort();

  expect(typeof port).toBe(`number`);
});
