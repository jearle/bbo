import { PermissionsService } from '../../services/permissions';
import { createPermissionsFilter } from '../../helpers/elasticsearch/permissions-filter';

interface PermissionsMiddlewareOptions {
  permissionsService: PermissionsService;
}

export const permissionsMiddleware = ({
  permissionsService,
}: PermissionsMiddlewareOptions) => {
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
