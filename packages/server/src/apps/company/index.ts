import * as express from 'express';

export const VERSION = `0.0.0`;
export const DESCRIPTION = `Company API`;
export const BASE_PATH = `/api/company/${VERSION}`;

export const createApp = () => {
  const app = express();

  /**
   * @swagger
   *
   * /health:
   *   get:
   *     description: Gets health of app
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: health
   */
  app.get(`/health`, (req, res) =>
    res.json({ title: `Company API`, health: `ok`, version: VERSION })
  );

  return app;
};
