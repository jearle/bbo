import { Request, Response } from 'express';
import { UserActivityService } from '../../services/user-activity';
import { decode } from 'jsonwebtoken';
import * as interceptor from 'express-interceptor';

type UserMiddlewareInputs = {
  userActivityService: UserActivityService;
};

type AfterSendIdentityInputs = {
  oldBody: string;
  userActivityService: UserActivityService;
};

type AfterSendTrackInputs = {
  req: Request;
  res: Response;
  userActivityService: UserActivityService;
};

const afterSendIdentity = ({
  oldBody,
  userActivityService,
}: AfterSendIdentityInputs): void => {
  const {
    data: { accessToken },
  } = JSON.parse(oldBody);

  const token = decode(accessToken) || {
    sub: `unknown`,
    username: `unknown`,
  };

  const { sub: userId, username: email } = token;

  const identifyInfo = {
    userId,
    traits: {
      email,
    },
  };
  userActivityService.identify(identifyInfo);
};

const afterSendTrack = ({
  req,
  res,
  userActivityService,
}: AfterSendTrackInputs): void => {
  const { jwtPayload = { sub: null } } = req;
  const { statusCode } = res;
  const { sub: userId } = jwtPayload;

  const id = userId === null ? { anonymousId: `unknown` } : { userId };

  const trackInfo = {
    ...id,
    event: 'EventNameFromSwaggerDocs',
    properties: {
      statusCode,
      reqData: { data: 'reqbody or query parameters?' },
      resData: { data: 'data' },
    },
  };

  userActivityService.track(trackInfo);
};

export const userActivityMiddleWare = ({
  userActivityService,
}: UserMiddlewareInputs): void => {
  return interceptor((req, res) => ({
    isInterceptable() {
      return true;
    },
    intercept(body, send) {
      send(body);
    },
    afterSend(oldBody) {
      switch (req.url) {
        case `/login`:
        case `/register`:
          afterSendIdentity({ oldBody, userActivityService });
          break;
        default:
          afterSendTrack({ req, res, userActivityService });
      }
    },
  }));
};
