import * as express from 'express';

import { loggerErrorMiddleware } from '.';

import { fetchResponseOnRandomPort } from '../../../../helpers/express/listen-fetch';

import logger from '../..';

describe(`loggerErrorMiddleware`, () => {
  let app;
  let env = 'test';

  beforeEach(() => {
    app = express();
  });

  test(`no error thrown`, async () => {
    app.get(`/`, (req, res) => {
      res.json({});
    });

    app.use(loggerErrorMiddleware({ logger, env }));

    const { status } = await fetchResponseOnRandomPort(app);

    expect(status).toBe(200);
  });

  test(`error logged and returned`, async () => {
    app.get(`/`, (req, res) => {
      throw new Error('Something went horribly wrong!');
    });

    app.use(loggerErrorMiddleware({ logger, env }));

    const originalLoggerError = logger.error;
    logger.error = jest.fn();

    const response = await fetchResponseOnRandomPort(app);
    const { detail } = await response.json();

    expect(logger.error).toBeCalled();
    expect(response.status).toBe(500);
    expect(detail).toMatch(/Something went horribly wrong/);

    console.error = originalLoggerError;
  });
});
