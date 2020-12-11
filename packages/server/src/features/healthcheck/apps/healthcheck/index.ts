import * as express from 'express';
import { Application } from 'express';

import { TransactionsSearchService } from '../../../transactions-search/services/transactions-search';

export const VERSION = `v0`;
export const DESCRIPTION = `Ping`;
export const BASE_PATH = `/api/healthcheck/${VERSION}`;

type CreateAppInputs = {
  readonly transactionsSearchService: TransactionsSearchService;
};

export const createApp = ({
  transactionsSearchService,
}: CreateAppInputs): Application => {
  const app = express();

  app.get(`/ping`, async (req, res) => {
    res.sendStatus(200);
  });

  app.get(`/healthcheck`, async (req, res) => {
    const endpoints = [await transactionsSearchService.health()];
    const status = endpoints.reduce(
      (maxStatus, currentService) => Math.max(maxStatus, currentService.status),
      0
    );
    const nonOkMessages = endpoints.filter((e) => e.msg !== 'ok');
    const msg =
      nonOkMessages.length === 0
        ? 'ok'
        : nonOkMessages.reduce(
            (msg, currentService) => `${msg}${currentService.msg};`,
            ''
          );

    res.json({
      name: 'Product API',
      status,
      msg,
      endpoints,
    });
  });

  return app;
};
