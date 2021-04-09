import * as express from 'express';
import { Application } from 'express';
import { body, validationResult } from 'express-validator';

import { TransactionsSearchService } from '../../services/transactions-search';
import { currencyValidator } from '../../validators/currency';
import { rentableAreaValidator } from '../../validators/rentable-area';

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
   *     tags:
   *      - Transactions Search
   *     servers:
   *      - url: /api/transactions-search/v0
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
   *     tags:
   *      - Transactions Search
   *     servers:
   *      - url: /api/transactions-search/v0
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
    const { permissionsFilter } = req;
    const { limit, page } = req.query;
    const data = await transactionsSearchService.searchTransactions({
      limit,
      page,
      permissionsFilter,
    });
    res.json({ data });
  });

  /**
   * @swagger
   *
   * /trends:
   *   post:
   *     tags:
   *      - Transactions Search
   *     servers:
   *      - url: /api/transactions-search/v0
   *     description: Search property transactions to return trends aggregates
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: debug
   *         in: query
   *         description: optional | returns the raw ES request/response if true
   *         required: false
   *         schema:
   *           type: boolean
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
   *                     enum: [PRICE, PROPERTY, UNITS, AREA, CAPRATE, PPU, PPA]
   *                   currency:
   *                     type: string
   *                     enum: [USD, EUR, GBP, JPY, AUD, CAN, CNY, LOC]
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
  app.post(
    `/trends`,
    body('aggregation').custom(currencyValidator).custom(rentableAreaValidator),
    body(`geographyFilter`).exists({ checkNull: true }),
    body(`propertyTypes`).exists({ checkNull: true }),
    async (req, res) => {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
      }

      const { propertyTypes } = req.body;

      const { geographyFilter, aggregation } = req.body;
      const { debug } = req.query;
      const { permissionsFilter } = req;

      try {
        const trends = await transactionsSearchService.searchTrends({
          geographyFilter,
          propertyTypes,
          aggregation,
          permissionsFilter,
        });

        const { data } = trends;
        const json = debug === `true` ? trends : { data };

        res.json(json);
      } catch (error) {
        const { message } = error;

        res.status(500).json({
          error: message,
          data: {},
        });
      }
    }
  );

  return app;
};
