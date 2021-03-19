import * as express from 'express';
import { Application } from 'express';
import { CurrencyService } from '../../services/currency';
import { DataTypeService } from '../../services/data-type';

export const VERSION = `v0`;
export const DESCRIPTION = `Lookups API`;
export const BASE_PATH = `/api/lookups/${VERSION}`;

type CreateAppInputs = {
  readonly currencyService: CurrencyService;
  readonly dataTypeService: DataTypeService;
};

export const createApp = ({
  currencyService,
  dataTypeService,
}: CreateAppInputs): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /currency:
   *  get:
   *    description: Gets currency lookup values
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: CurrencyLookupsResponse
   */
  app.get(`/currency`, async (req, res) => {
    const data = currencyService.getCurrencies();
    res.json({ data });
  });

  /**
   * @swagger
   *
   * /data-type
   *  get:
   *    description: Gets data type lookup values
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: DataTypeLookupsResponse
   */
  app.get(`/data-type/:propertyType`, async (req, res) => {
    const { propertyType } = req.params;

    const data = dataTypeService.getDataTypes({ propertyType });

    res.json({ data });
  });

  return app;
};
