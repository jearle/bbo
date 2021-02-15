import * as express from 'express';
import { Application } from 'express';

import { TransactionsSearchService } from '../../services/transactions-search';

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
    // const { permissionsFilter } = req; // todo: add back permissionfilter
    const { query } = req;
    const data = await transactionsSearchService.search({
      query,
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
   *                geographyFilter:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   type:
   *                     type: integer
   *                   name:
   *                     type: string
   *                aggregation:
   *                 type: object
   *                 properties:
   *                   aggregationType:
   *                     type: string
   *                   currency:
   *                     type: string
   *                propertyTypeFilter:
   *                 type: object
   *                 properties:
   *                   propertyTypeId:
   *                     type: integer
   *                   allPropertySubTypes:
   *                     type: boolean
   *                   propertySubTypeIds:
   *                     type: array
   *                     items:
   *                      type: integer
   *     responses:
   *       200:
   *         description: TrendsAggregationResponse
   */
  app.post(`/trends`, async (req, res) => {
    const { geographyFilter, propertyTypeFilter, aggregation } = req.body;
    const { debug } = req.query;
    const result = await transactionsSearchService.getTrends({
      geographyFilter,
      propertyTypeFilter,
      aggregation,
    });
    if (debug === 'true') {
      res.json(result);
    } else {
      const { data } = result;
      res.json({ data });
    }
  });

  return app;
};
