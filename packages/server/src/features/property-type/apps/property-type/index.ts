import * as express from 'express';
import { Application } from 'express';
import { PropertyTypeService } from '../../services/property-type';

export const VERSION = `v0`;
export const DESCRIPTION = `PropertyType`;
export const BASE_PATH = `/api/property-type/${VERSION}`;

type CreateAppInputs = {
  readonly propertyTypeService: PropertyTypeService;
};

export const createApp = ({
  propertyTypeService,
}: CreateAppInputs): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /property-type:
   *   get:
   *     tags:
   *      - Property Type
   *     servers:
   *      - url: /api/property-type/v0
   *     summary: Get list of property types
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: PropertyTypeMenuResponse
   */
  app.get(`/property-type`, async (_, res) => {
    try {
      const data = await propertyTypeService.fetchPropertyTypes();

      res.json({ data });
    } catch ({ message: error }) {
      res.status(500).json({
        error,
        data: [],
      });
    }
  });

  return app;
};
