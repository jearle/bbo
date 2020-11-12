import * as express from 'express';
import { LDClient } from 'launchdarkly-node-server-sdk';
import logger from '../../logger';
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

  /**
   * @swagger
   *
   * /launchdarkly/{flagName}:
   *   get:
   *     description: hits launch darkly to fetch our sample flag
   *     produces:
   *       - application/json
   *     parameters:
   *     - name: flagName
   *       in: path
   *       description: name of the flag in launchdarkly, ex: ff-release-api-27-set-up-launch-darkly
   *       required: true
   *     - name: defaultValue
   *       in: query
   *       description: optional default value to return
   *       required: false   
   *     responses:
   *       200:
   *         description: flag value
   */
  app.get(`/launchdarkly/:flagName`, async (req, res) => {
    const flagName = req.params.flagName;
    const defaultValueTx = req.query.defaultValue;
    const defaultValue = defaultValueTx?.toLowerCase() === 'true' || defaultValueTx?.toLowerCase() === 'false'
      ? JSON.parse(defaultValueTx.toLowerCase()) : defaultValueTx;
    const value = await fetchLaunchDarklyFlag({ client: launchDarklyClient, flagName: flagName, defaultValue });
    if (!value) {
      res.status(404).send('Not Found');
    } else {
      res.json({ description: `Test ${flagName}`, flagValue: value, version: VERSION });
    }
  });

  return app;
};
