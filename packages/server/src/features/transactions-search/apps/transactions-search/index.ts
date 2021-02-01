import * as express from 'express';
import { Application } from 'express';

import { TransactionsSearchService } from '../../services/transactions-search';
import { cleanTransactionsSearchQuery } from '../../helpers/clean-transactions-search';

export const VERSION = `v0`;
export const DESCRIPTION = `Transactions Search API`;
export const BASE_PATH = `/api/transactions-search/${VERSION}`;

type CreateAppInputs = {
  readonly transactionsSearchService: TransactionsSearchService;
};

export const createApp = ({
  transactionsSearchService,
}: CreateAppInputs): Application => {
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
  app.get(`/healthcheck`, async (req, res) => {
    res.json({ description: DESCRIPTION, health: `ok`, version: VERSION });
  });

  /**
   * @swagger
   *
   * /transactions:
   *   get:
   *     description: Search property transactions
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: limit
   *         in: query
   *         description: The response item limit
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: PropertyTransactionSearchResponse
   */
  app.get(`/transactions`, async (req, res) => {
    const { query, permissionsFilter } = req;
    const { page, limit } = cleanTransactionsSearchQuery(query);
    const data = await transactionsSearchService.search({
      page,
      limit,
      filter: permissionsFilter,
    });

    res.json({ data });
  });

  /**
   * @swagger
   *
   * /transactions:
   *   get:
   *     description: Search property transactions
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: limit
   *         in: query
   *         description: The response item limit
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: PropertyTransactionSearchResponse
   */
  app.get(`/transactions`, async (req, res) => {
    const { query, permissionsFilter } = req;
    const { page, limit } = cleanTransactionsSearchQuery(query);
    const data = await transactionsSearchService.search({
      page,
      limit,
      filter: permissionsFilter,
    });

    res.json({ data });
  });

  return app;
};
