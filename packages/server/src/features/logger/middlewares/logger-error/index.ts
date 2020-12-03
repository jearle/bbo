export const loggerErrorMiddleware = ({ logger, env }) => (
  err,
  req,
  res,
  next
) => {
  logger.log(`error`, `[${req.id}] ${err.stack}`);

  const { id: instance } = req;
  const title = env !== `production` ? err.message : `Internal Error Occurred`;
  const detail = env !== `production` ? err.stack : ``;
  const status = 500;
  const type = 'about:blank';

  res.status(status).type('application/problem+json').json({
    instance,
    title,
    detail,
    status,
    type,
  });

  next();
};
