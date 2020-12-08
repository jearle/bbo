import * as morgan from 'morgan';
import { v4 as uuid } from 'uuid';

type LoggerIdRequest = Request & {
  id: string;
};

type LoggerIdMiddlewareResult = (
  req: LoggerIdRequest,
  res: Response,
  next: () => void
) => void;

export const loggerIdMiddleware = (): LoggerIdMiddlewareResult => {
  morgan.token(`id`, ({ id }) => id);

  return (req, res, next) => {
    req.id = uuid();
    next();
  };
};
