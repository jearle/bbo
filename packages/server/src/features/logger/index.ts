/* istanbul ignore file */
import { loggerMiddleware } from './middlewares/logger';
import { loggerIdMiddleware } from './middlewares/logger-id';
import { loggerErrorMiddleware } from './middlewares/logger-error';

import { createLogger, Logger } from './providers/winston';

export { Logger } from './providers/winston';

type LoggerFeatureInputs = {
  readonly logger: Logger;
};

type LoggerFeatureOptions = {
  readonly logger?: Logger;
};

const { LOG_LEVEL: logLevel, NODE_ENV } = process.env;

const logType = NODE_ENV === `production` ? `JSON` : `PRETTY_STRING`;

const loggerSingleton: Logger = createLogger({
  logLevel,
  logType,
});

const loggerFeature = ({ logger }: LoggerFeatureInputs) => ({
  logger,

  loggerIdMiddleware,

  loggerMiddleware() {
    return loggerMiddleware({ logger });
  },

  loggerErrorMiddleware() {
    return loggerErrorMiddleware({ logger, env: NODE_ENV });
  },
});

type LoggerFeature = ReturnType<typeof loggerFeature>;

export const createLoggerFeature = ({
  logger = loggerSingleton,
}: LoggerFeatureOptions = {}): LoggerFeature => {
  return loggerFeature({ logger });
};

export default loggerSingleton;
