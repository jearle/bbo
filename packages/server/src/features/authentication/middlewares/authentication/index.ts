import { Request, Response } from 'express';

import { AuthenticationService } from '../../services/authentication';

type AuthenticationMiddlewareInput = {
  authenticationService: AuthenticationService;
};

type AuthenticationMiddlewareResult = (
  req: Request,
  res: Response,
  next: Function
) => void;

export const authenticationMiddleware = ({
  authenticationService,
}: AuthenticationMiddlewareInput): AuthenticationMiddlewareResult => async (
  req,
  res,
  next
) => {
  const token = req.get(`accesstoken`);

  if (!token) {
    return res.status(401).json({
      data: {
        error: `Invalid JWT Token`,
      },
    });
  }

  try {
    await authenticationService.validate({ token });
  } catch (e) {
    return res.status(401).json({
      data: {
        error: e.message,
      },
    });
  }

  next();
};
