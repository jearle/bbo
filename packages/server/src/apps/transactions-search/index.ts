import * as express from 'express';

import { TransactionsService } from './services/transactions';

export const VERSION = `0.0.0`;
export const DESCRIPTION = `Transactions Search API`;
export const BASE_PATH = `/api/transactions-search/${VERSION}`;

interface Options {
  transactionsService: TransactionsService;
}

export const createApp = ({ transactionsService }: Options) => {
  const app = express();

  /**
   * @swagger
   *
   * /healthcheck:
   *   get:
   *     description: Gets health of app
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: health
   */
  app.get(`/healthcheck`, (req, res) =>
    res.json({ description: DESCRIPTION, health: `ok`, version: VERSION })
  );

  return app;
};
