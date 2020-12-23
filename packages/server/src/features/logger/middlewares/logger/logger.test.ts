import * as express from 'express';

import logger from '../../';
import { loggerMiddleware } from '../logger';
import { loggerIdMiddleware } from '../logger-id';

import { fetchResponseOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';

describe(`loggerErrorMiddleware`, () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(loggerIdMiddleware());
    app.use(
      loggerMiddleware({
        logger,
      })
    );
  });

  test(`no error thrown`, async () => {
    const originalInfo = logger.info;
    logger.info = jest.fn();

    app.get(`/`, (req, res) => {
      res.send(`foo`);
    });

    await fetchResponseOnRandomPort(app);

    expect(logger.info).toBeCalled();
    logger.info = originalInfo;
  });
});
