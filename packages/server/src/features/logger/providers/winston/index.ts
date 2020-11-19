import {
  createLogger as createWinstonLogger,
  format,
  transports,
} from 'winston';
import { prettyStringFormat } from './pretty-string-format';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';

type LogType = `JSON` | `PRETTY_STRING`;

type GetLogTypeInput = {
  logType: LogType;
};

type CreateLoggerInput = {
  logLevel: string;
  logType: LogType;
};

const getLogTypeFormat = ({ logType }: GetLogTypeInput) => {
  switch (logType) {
    case `JSON`: {
      return format.json();
    }
    case `PRETTY_STRING`: {
      return prettyStringFormat();
    }
    default: {
      throw new TypeError(
        `logType needs to be 'JSON' or 'PRETTY_STRING, received '${logType}'`
      );
    }
  }
};

const createConsoleTransport = ({
  logLevel,
  logTypeFormat,
}): ConsoleTransportInstance =>
  new transports.Console({
    level: logLevel,
    format: format.combine(format.timestamp(), logTypeFormat),
    handleExceptions: true,
  });

export const createLogger = ({ logLevel, logType }: CreateLoggerInput) => {
  const logTypeFormat = getLogTypeFormat({ logType });

  return createWinstonLogger({
    transports: [createConsoleTransport({ logLevel, logTypeFormat })],
  });
};
