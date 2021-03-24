import * as express from 'express';
import { Application } from 'express';
import { body, validationResult } from 'express-validator';

import { TransactionsSearchService } from '../../services/transactions-search';
import { currencyValidator, rentableAreaValidator } from "../../middlewares/validation";

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
   *                     enum: [PRICE, PROPERTY, UNITS, SQFT, CAPRATE, PPU, PPSF]
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
    async (req, res) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() })
      }

      const { geographyFilter, propertyTypeFilter, aggregation } = req.body;
      const { debug } = req.query;
      const { permissionsFilter } = req;
      const {
        data,
        index,
        request,
        response,
      } = await transactionsSearchService.searchTrends({
        geographyFilter,
        propertyTypeFilter,
        aggregation,
        permissionsFilter,
      });
      if (debug === 'true') {
        res.json({ data, index, request, response });
      } else {
        res.json({ data });
      }
    }
  );

  return app;
};
