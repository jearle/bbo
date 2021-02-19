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
   *   get:
   *     description: Refreshes users permissions
   *     responses:
   *       204:
   *         description: no content
   */
  app.get(`/refresh`, async (req, res) => {
    const { userId } = req.query;

    await permissionsService.clearCachedPermissionsModel({ userId });

    res.sendStatus(204);
  });

  return app;
};
