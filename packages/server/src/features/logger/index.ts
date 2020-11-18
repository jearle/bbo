/* istanbul ignore file */

import { createLogger } from './providers/winston';

const { LOG_LEVEL: logLevel, NODE_ENV } = process.env;

const logType = NODE_ENV === `production` ? `JSON` : `PRETTY_STRING`;

const logger = createLogger({
  logLevel,
  logType,
});

export default logger;
