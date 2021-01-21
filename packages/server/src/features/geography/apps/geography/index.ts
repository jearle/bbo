import * as express from 'express';
import { Application } from 'express';

export const VERSION = `v0`;
export const DESCRIPTION = `Geography`;
export const BASE_PATH = `/api/geography/${VERSION}`;

export const createApp = (): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /ping:
   *   get:
   *     description: Responds with 200 OK
   *     produces:
   *       - text/plain
   *     responses:
   *       200:
   *         description: OK
   */
  app.get(`/ping`, async (req, res) => {
    res.sendStatus(200);
  });

  return app;
};
