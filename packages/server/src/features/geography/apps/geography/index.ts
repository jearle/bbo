import * as express from 'express';
import { Application } from 'express';
import { GeographyService } from '../../services/geography';

export const VERSION = `v0`;
export const DESCRIPTION = `Geography`;
export const BASE_PATH = `/api/geography/${VERSION}`;

type CreateAppInputs = {
  readonly geographyService: GeographyService;
};

export const createApp = ({
  geographyService,
}: CreateAppInputs): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /geography:
   *   get:
   *     summary: Get list of geographies
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
   *         description: GeographyResponse
   */
  app.get(`/geography`, async (req, res) => {
    const data = await geographyService.fetchGeographies();

    res.json({ data });
  });

  return app;
};
