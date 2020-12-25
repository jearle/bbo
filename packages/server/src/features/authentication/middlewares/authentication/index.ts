import { Request, Response } from 'express';

import { AuthenticationService } from '../../services/authentication';

type AuthenticationMiddlewareInput = {
  authenticationService: AuthenticationService;
};

type AuthenticationMiddlewareResult = (
  req: Request,
  res: Response,
  next: () => void
) => void;

export const authenticationMiddleware = ({
  authenticationService,
}: AuthenticationMiddlewareInput): AuthenticationMiddlewareResult => async (
  req,
  res,
  next
) => {
  const token = req.get(`accesstoken`);
  const { id: instance } = req;
  const status = 401;
  const contentType = 'application/problem+json';
  const title = 'Unauthorized';
  const type = 'about:blank';

  if (!token) {
    return res.type(contentType).status(status).json({
      instance,
      title,
      detail: `Missing JWT Token`,
      status,
      type,
    });
  }

  try {
    const jwtPayload = await authenticationService.validate({ token });
    req.jwtPayload = jwtPayload;
  } catch (e) {
    return res.type(contentType).status(status).json({
      instance,
      title,
      detail: `Invalid JWT Token`,
      status,
      type,
      error: e,
    });
  }

  next();
};
