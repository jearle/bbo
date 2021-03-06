import * as express from 'express';
import { Application } from 'express';

import { AuthenticationService } from '../../services/authentication';
export const VERSION = `v0`;
export const DESCRIPTION = `Authentication Search API`;
export const BASE_PATH = `/api/authentication/${VERSION}`;

interface Options {
  authenticationService: AuthenticationService;
}

export const createApp = ({ authenticationService }: Options): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /healthcheck:
   *   get:
   *     tags: 
   *      - Authentication
   *     servers:
   *      - url: /api/authentication/v0
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
   * /login:
   *   post:
   *     tags: 
   *      - Authentication
   *     servers: 
   *      - url: /api/authentication/v0
   *     summary: Retrieves access token
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: health
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *                 idToken:
   *                   type: string
   *                 expiresIn:
   *                   type: number
   *                 tokenType:
   *                   type: string
   */
  app.post(`/login`, async (req, res) => {
    const { username, password } = req.body;

    try {
      const data = await authenticationService.authenticateUser({
        username,
        password,
      });

      res.json({
        data,
        error: null,
      });
    } catch ({ message: error }) {
      res.status(401).json({
        data: {},
        error,
      });
    }
  });

  /**
   * @swagger
   *
   * /logout:
   *   post:
   *     tags: 
   *      - Authentication
   *     servers:
   *      - url: /api/authentication/v0
   *     summary: Log out the user
   *     responses:
   *       200:
   *         description: OK
   *       401: 
   *         description: unauthorized
   */
  app.post(`/logout`, async (req, res) => {
    const accessToken = req.get('accessToken');
    if (!accessToken) {
      res.sendStatus(401);
      return;
    }
    await authenticationService.logout({ accessToken });
    res.sendStatus(200);
  });

  return app;
};
