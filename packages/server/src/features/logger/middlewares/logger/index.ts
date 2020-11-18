import * as morgan from 'morgan';

export const loggerMiddleware = ({ logger }) =>
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
