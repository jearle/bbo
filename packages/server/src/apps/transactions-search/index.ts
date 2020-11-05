import * as express from 'express';

import {
  TransactionSearchParams,
  TransactionsService,
  cleanTransactionSearchParams,
} from './services/transactions';

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

  /**
   * @swagger
   *
   * /transactions:
   *   get:
   *     description: Search property transactions
   *     produces:
   *       - application/json
   *     parameters:
   *     - name: limit
   *       in: query
   *       description: The response item limit
   *       required: true
   *       schema:
   *         type: number
   *     responses:
   *       200:
   *         description: PropertyTransactionSearchResponse
   */
  app.get(`/transactions`, async (req, res) => {
    const transactionSearchParams = cleanTransactionSearchParams(req.query);

    const data = await transactionsService.search(transactionSearchParams);

    res.json({ data });
  });

  return app;
};
