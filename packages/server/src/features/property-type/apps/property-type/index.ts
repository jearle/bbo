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
   *   get:
   *     description: Get list of property types
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
   *         description: PropertyTypeResponse
   *
   */
  app.get(`/property-type`, async (req, res) => {
    const result = await propertyTypeService.fetchPropertyTypes();
    res.json(result);
  });

  return app;
};
