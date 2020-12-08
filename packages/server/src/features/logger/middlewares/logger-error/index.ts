import { Request, Response } from 'express';
import { Logger } from '../../providers/winston';

type LoggerErrorMiddlewareInputs = {
  readonly logger: Logger;
  readonly env: string;
};

type LoggerErrorMiddlewareResult = (
  err: Error,
  req: Request,
  res: Response,
  next: () => void
) => void;

export const loggerErrorMiddleware = ({
  logger,
  env,
}: LoggerErrorMiddlewareInputs): LoggerErrorMiddlewareResult => (
  err,
  req,
  res,
  next
) => {
  logger.error(`[${req.id}] ${err.stack}`);

  const { id: instance } = req;
  const title = env !== `production` ? err.message : `Internal Error Occurred`;
  const detail = env !== `production` ? err.stack : ``;
  const status = 500;
  const type = 'about:blank';

  res.status(status).type('application/problem+json').json({
    instance,
    title,
    detail,
    status,
    type,
  });

  next();
};
