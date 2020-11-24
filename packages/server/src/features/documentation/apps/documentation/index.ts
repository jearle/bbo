import * as express from 'express';
import { serve, setup } from 'swagger-ui-express';
import { createSpec } from '../../helpers/spec';

export const VERSION = `v0`;
export const DESCRIPTION = `Documentation`;
export const BASE_PATH = `/api/documentation/${VERSION}`;

export const createApp = ({ feature, description, host, port, basePath }) => {
  const app = express();

  app.use(
    serve,
    setup(createSpec({ feature, description, host, port, basePath }))
  );

  return app;
};
