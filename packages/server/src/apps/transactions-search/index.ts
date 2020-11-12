import * as express from 'express';
import { LDClient } from 'launchdarkly-node-server-sdk';
import { createLaunchDarklyClient, fetchLaunchDarklyFlag, LDClientType } from '../../services/launchdarkly';

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
  launchDarklyClient: LDClientType;
}

export const createApp = ({ transactionsService, launchDarklyClient }: Options) => {
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
  }
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

  // TODO remove sample route and archive flag in LD
  /**
   * @swagger
   *
   * /test-launchdarkly:
   *   get:
   *     description: hits launch darkly to fetch our sample flag
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: flag value
   */
  app.get(`/test-launchdarkly`, async (req, res) => {
    const value = await fetchLaunchDarklyFlag({ client: launchDarklyClient, flagName: 'ff-release-api-17-set-up-launch-darkly' });
    if (!value) {
      res.status(404).send('Not Found');
    } else {
      res.json({ description: 'Test ff-release-api-17-set-up-launch-darkly', flagValue: value, version: VERSION });
    }
  });

  return app;
};
