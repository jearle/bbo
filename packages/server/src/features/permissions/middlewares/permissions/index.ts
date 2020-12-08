import { Request, Response } from 'express';
import { PermissionsService } from '../../services/permissions';
import { createPermissionsFilter } from '../../helpers/elasticsearch/permissions-filter';

type PermissionsMiddlewareOptions = {
  permissionsService: PermissionsService;
};

type PermissionsMiddlewareResult = (
  req: Request,
  res: Response,
  next: () => void
) => void;

export const permissionsMiddleware = ({
  permissionsService,
}: PermissionsMiddlewareOptions): PermissionsMiddlewareResult => {
  return async (req, res, next) => {
    const { username } = req.jwtPayload;

    const permissionsModel = await permissionsService.fetchPermissionsModel({
      username,
    });

    const permissionFilter = createPermissionsFilter({ permissionsModel });

    req.permissionsModel = permissionsModel;
    req.permissionsFilter = permissionFilter;

    next();
  };
};
