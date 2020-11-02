import * as express from 'express';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import {
  createApp as createCompanyApp,
  BASE_PATH as companyBasePath,
  DESCRIPTION as companyDescription,
} from './apps/company';
import logger, {
  loggerIdMiddlewware,
  loggerMiddleware,
  loggerErrorMiddleware,
} from './logger';

import { useSwaggerDocumentation } from './helpers/swagger/express-mount';

interface ServerOptions {
  port?: number;
  host?: string;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`,
}: ServerOptions) => {
  const mounts = express();

  const companyApp = createCompanyApp();

  mounts.use(loggerIdMiddlewware());
  mounts.use(loggerMiddleware());

  mounts.use(companyBasePath, companyApp);
  useSwaggerDocumentation(mounts, {
    host,
    port,
    basePath: companyBasePath,
    description: companyDescription,
  });

  mounts.use(loggerErrorMiddleware());

  const server = createServer(mounts);

  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    logger.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};
