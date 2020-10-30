import { createLogger, format, transports } from 'winston';
import { blue, green, bgRed, yellow, bgMagenta, red } from 'chalk';
import * as morgan from 'morgan';
import { v4 as uuid } from 'uuid';

const { LOG_LEVEL = `info`, NODE_ENV = `development` } = process.env;

const printfFormat = () => {
  if (NODE_ENV === `production`) return format.json();

  return format.printf((info) => {
    const { timestamp, level, message } = info;

    const colorFunction = {
      debug: bgMagenta,
      info: green,
      warn: yellow,
      error: bgRed,
    }[level];

    const coloredLevel = colorFunction ? colorFunction(level) : level;

    return `${blue(timestamp)} ${coloredLevel} ${message}`;
  });
};

const logger = createLogger({
  transports: [
    new transports.Console({
      level: LOG_LEVEL,
      format: format.combine(format.timestamp(), printfFormat()),
      handleExceptions: true,
    }),
  ],
});

logger.log(`debug`, `logger using log level: ${LOG_LEVEL}`);

export default logger;

export const loggerIdMiddlewware = () => {
  morgan.token(`id`, ({ id }) => id);

  return (req, res, next) => {
    req.id = uuid();
    next();
  };
};

export const loggerMiddleware = () =>
  morgan(
    `[:id] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
    {
      stream: {
        write(message) {
          logger.info(message);
        },
      },
    }
  );

export const loggerErrorMiddleware = () => {
  return function (err, req, res, next) {
    logger.log(`error`, `[${req.id}] ${err.stack}`);

    const { id } = req;
    const message =
      NODE_ENV !== `production` ? err.message : `Internal Error Occurred`;
    const stack = NODE_ENV !== `production` ? err.stack : ``;

    res.json({
      error: {
        id,
        message,
        stack,
      },
    });
  };
};
