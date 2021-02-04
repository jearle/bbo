import * as express from 'express';
import { Application } from 'express';

import { TransactionsSearchService } from '../../services/transactions-search';
import { cleanTransactionsSearchQuery } from '../../helpers/clean-transactions-search';
import { trendsSearchQuery } from '../../helpers/trends-search';

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
  app.use(express.json());

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
    const esQuery = cleanTransactionsSearchQuery(query);
    const data = await transactionsSearchService.search({
      esQuery: esQuery
    });
    res.json({ data });
  });

  /**
   * @swagger
   *
   * /trends:
   *   post:
   *     description: Search property transactions to return trends aggregates
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               GeographyFilter:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   type:
   *                     type: integer
   *                   name:
   *                     type: string
   *     responses:
   *       200:
   *         description: TrendsSearchResponse
   */
  app.post(`/trends`, async (req, res) => {
    const { GeographyFilter } = req.body;
    const esQuery = trendsSearchQuery({ GeographyFilter, limit: 10 }); // todo: limit just for debugging, can use default 0 once we have aggs
    const data = await transactionsSearchService.search({
      esQuery
    });
    res.json({ data });
  });

  return app;
};
