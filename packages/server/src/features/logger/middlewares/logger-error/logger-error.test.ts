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
    const error = new Error('Something went horribly wrong!');
    app.get(`/`, (req, res) => {
      throw error;
    });
    app.use(loggerErrorMiddleware({ logger, env }));

    const spy = jest.spyOn(logger, 'error');

    const response = await fetchResponseOnRandomPort(app);
    const { detail } = await response.json();

    expect(spy).toBeCalled();
    expect(response.status).toBe(500);
    expect(detail).toMatch(/Something went horribly wrong/);
  });
});
