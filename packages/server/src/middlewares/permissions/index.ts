import { PermissionsService } from '../../services/permissions';

interface PermissionsMiddlewareOptions {
  permissionsService: PermissionsService;
}

export const permissionsMiddleware = ({
  permissionsService,
}: PermissionsMiddlewareOptions) => {
  return async (req, res, next) => {
    const { userId } = req;

    const permissionModel = await permissionsService.fetchPermissionModel({
      userId,
    });

    req.permissionModel = permissionModel;

    next();
  };
};
