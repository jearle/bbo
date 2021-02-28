import { Request, Response } from 'express';

type HandlerResult = unknown;

export type Handlers = { [key: string]: (req: Request) => HandlerResult };

type TargetHandlerMiddlewareInput = {
  readonly handlers: Handlers;
};

type TargetHandlerMiddlewareResult = (
  req: Request,
  res: Response,
  next: () => void
) => void;

export const targetHandlerMiddleware = ({
  handlers,
}: TargetHandlerMiddlewareInput): TargetHandlerMiddlewareResult => (
  req,
  res,
  next
) => {
    const { [`x-amz-target`]: amazonTarget } = req.headers;
    const targetName = amazonTarget.split(`.`)[1];
    const target = targetName[0].toLowerCase() + targetName.slice(1);

    const handler = handlers[target];

    req.target = target;
    req.handler = handler;

    next();
  };
