import { PermissionsService } from '../../services/permissions';
import { createPermissionFilter } from '../../services/permissions/permission-filter';

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
    const permissionFilter = createPermissionFilter({ permissionModel });

    req.permissionModel = permissionModel;
    req.permissionFilter = permissionFilter;

    next();
  };
};
