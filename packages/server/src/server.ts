import * as express from 'express';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { createCompanyApp, VERSION } from './apps/company';
import logger, {
  loggerIdMiddlewware,
  loggerMiddleware,
  loggerErrorMiddleware,
} from './logger';

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
  mounts.use(`/api/company/${VERSION}`, companyApp);
  mounts.use(loggerErrorMiddleware());

  const server = createServer(mounts);

  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    logger.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};
