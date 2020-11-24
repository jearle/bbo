import * as express from 'express';
import { LDClient } from 'launchdarkly-node-server-sdk';
import logger from '../../features/logger';
import {
  createLaunchDarklyClient,
  fetchLaunchDarklyFlag,
  LDClientType,
} from '../../services/launchdarkly';

import {
  TransactionSearchParams,
  TransactionsService,
  cleanTransactionSearchParams,
} from './services/transactions';

export const VERSION = `v0`;
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

  /**
   * @swagger
   *
   * /feature-flag:
   *   get:
   *     description: behind a feature flag
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: flag value
   */
  app.get(`/feature-flag`, async (req, res) => {
    res.json({ response: `ok` });
  });

  return app;
};
