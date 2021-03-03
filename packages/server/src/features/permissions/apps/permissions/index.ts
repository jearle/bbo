import * as express from 'express';
import { Application } from 'express';

import { PermissionsService } from '../../services/permissions';

export const VERSION = `v0`;
export const DESCRIPTION = `Permissions API`;
export const BASE_PATH = `/api/permission/${VERSION}`;

type Options = {
  permissionsService: PermissionsService;
};

export const createApp = ({ permissionsService }: Options): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /refresh:
   *     description: Refreshes the permissions for users
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *              properties:
   *                userId:
   *                 type: array
   *                   items:
   *                    type: string
   *     responses:
   *       204:
   *         description: No content
   */
  app.post(`/refresh`, async (req, res) => {
    const { userId } = req.body;
    userId.map(
      async (id) =>
        await permissionsService.clearCachedPermissionsModel({ userId: id })
    );
    res.sendStatus(204);
  });

  return app;
};
