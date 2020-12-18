import * as express from 'express';

import logger from '../../';
import { loggerMiddleware } from '../logger';
import { loggerIdMiddleware } from '.';

import { fetchTextOnRandomPort } from '../../../../helpers/express/listen-fetch';

describe(`loggerErrorMiddleware`, () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(
      loggerMiddleware({
        logger,
      })
    );
    app.use(loggerIdMiddleware());
  });

  test(`no error thrown`, async () => {
    const originalInfo = logger.info;
    logger.info = jest.fn();

    app.get(`/`, (req, res) => {
      res.send(req.id);
    });

    const text = await fetchTextOnRandomPort(app);

    expect(text.length).toBeGreaterThan(0);
    expect(logger.info).toBeCalled();
    logger.info = originalInfo;
  });
});
