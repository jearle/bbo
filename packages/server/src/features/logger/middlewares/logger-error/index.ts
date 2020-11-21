export const loggerErrorMiddleware = ({ logger, env }) => (
  err,
  req,
  res,
  next
) => {
  logger.log(`error`, `[${req.id}] ${err.stack}`);

  const { id } = req;
  const message =
    env !== `production` ? err.message : `Internal Error Occurred`;
  const stack = env !== `production` ? err.stack : ``;

  res.json({
    error: {
      id,
      message,
      stack,
    },
  });

  next();
};
