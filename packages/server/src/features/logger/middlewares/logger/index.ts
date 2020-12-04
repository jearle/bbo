import * as morgan from 'morgan';
import { Logger } from '../../providers/winston';

type LoggerMiddlewareInputs = {
  logger: Logger;
};

type LoggerMiddlewareResult = () => void;

export const loggerMiddleware = ({
  logger,
}: LoggerMiddlewareInputs): LoggerMiddlewareResult =>
  morgan(
    `[:id] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
    {
      stream: {
        write(message) {
          logger.info(message.trim());
        },
      },
    }
  );
