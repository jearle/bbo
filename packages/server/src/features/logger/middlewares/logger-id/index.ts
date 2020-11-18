import * as morgan from 'morgan';
import { v4 as uuid } from 'uuid';

export const loggerIdMiddleware = () => {
  morgan.token(`id`, ({ id }) => id);

  return (req, res, next) => {
    req.id = uuid();
    next();
  };
};
