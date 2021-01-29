import * as express from 'express';
import { Application } from 'express';
import { serve, setup } from 'swagger-ui-express';
import { createSpec } from '../../helpers/spec';

export const VERSION = `v0`;
export const DESCRIPTION = `Documentation`;
export const BASE_PATH = `/api/documentation/${VERSION}`;

type CreateAppInputs = {
  readonly feature: string;
  readonly description: string;
  readonly basePath: string;
  readonly version: string;
};

export const createApp = ({
  feature,
  description,
  basePath,
  version,
}: CreateAppInputs): Application => {
  const app = express();

  app.use(
    serve,
    setup(createSpec({ feature, description, basePath, version }))
  );

  return app;
};
