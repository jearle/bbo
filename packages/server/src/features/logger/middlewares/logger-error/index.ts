export const loggerErrorMiddleware = ({ logger, env }) => (
  err,
  req,
  res,
  next
) => {
  logger.log(`error`, `[${req.id}] ${err.message} ${err.stack}`);

  const { id } = req;
  const title = env !== `production` ? err.message : `Internal Error Occurred`;
  const detail = env !== `production` ? err.stack : ``;
  const status = 500;
  const type = 'about:blank';

  res.status(500).type('application/problem+json').json({
    id,
    title,
    detail,
    status,
    type,
  });

  next();
};
