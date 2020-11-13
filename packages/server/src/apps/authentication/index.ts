import * as express from 'express';

import { AuthenticationService } from '../../services/authentication';
export const VERSION = `v0`;
export const DESCRIPTION = `Authentication Search API`;
export const BASE_PATH = `/api/authentication/${VERSION}`;

interface Options {
  authenticationService: AuthenticationService;
}

export const createApp = ({ authenticationService }: Options) => {
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
  app.post(`/login`, async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await authenticationService.authenticateUser({
        username,
        password,
      });

      res.json(result);
    } catch (e) {
      res.status(401).json({
        data: {
          error: e.message,
        },
      });
    }
  });

  return app;
};
