import { UserActivityService } from '../../services/user-activity';
import { decode } from 'jsonwebtoken';

type UserMiddlewareInputs = {
  userActivityService: UserActivityService;
};

import * as interceptor from 'express-interceptor';

//Most things are hardcoded right now.
export const userActivityMiddleWare = ({
  userActivityService,
}: UserMiddlewareInputs): void => {
  return interceptor(function (req, res) {
    return {
      isInterceptable: function () {
        return true;
      },
      intercept: function (body, send) {
        send(body);
      },
      afterSend: function (oldBody, newBody) {
        if (['/login', '/register'].includes(req.url)) {
          const decoded = decode(JSON.parse(oldBody).accessToken);
          const identifyInfo = {
            userId: decoded.sub,
            traits: {
              email: decoded.username,
            },
          };
          userActivityService.identify(identifyInfo);
        } else {
          const trackInfo = {
            userId: req.jwtPayload.sub,
            event: 'EventNameFromSwaggerDocs',
            properties: {
              statusCode: res.statusCode,
              reqData: { data: 'reqbody or query parameters?' },
              resData: { data: 'data' },
            },
          };
          userActivityService.track(trackInfo);
        }
      },
    };
  });
};
