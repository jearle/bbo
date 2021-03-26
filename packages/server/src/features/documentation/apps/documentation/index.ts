import * as express from 'express';
import { Application } from 'express';
import { serve, setup } from 'swagger-ui-express';
import { createSpec } from '../../helpers/spec';

export const VERSION = `v0`;
export const DESCRIPTION = `Documentation`;
export const BASE_PATH = `/api/documentation/${VERSION}`;

type CreateAppInputs = {
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly apiPaths: string[];
};

export const createApp = ({
  title,
  description,
  version,
  apiPaths,
}: CreateAppInputs): Application => {
  const app = express();

  app.use(
    serve,
    setup(createSpec({ title, description, version, apiPaths }))
  );

  return app;
};
