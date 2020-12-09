/* istanbul ignore file */

import { createLogger, Logger } from './providers/winston';

const { LOG_LEVEL: logLevel, NODE_ENV } = process.env;

const logType = NODE_ENV === `production` ? `JSON` : `PRETTY_STRING`;

const logger: Logger = createLogger({
  logLevel,
  logType,
});

const loggerFeature = () => ({});

type LoggerFeature = ReturnType<typeof loggerFeature>;

export const createLoggerFeature = (): LoggerFeature => {
  return loggerFeature;
};

export default logger;
