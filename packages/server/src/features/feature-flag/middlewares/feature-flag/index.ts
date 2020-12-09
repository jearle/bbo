import { Request, Response } from 'express';

import { FeatureFlagService } from '../../services/feature-flag';

type FeatureFlagMiddlewareInput = {
  featureFlagService: FeatureFlagService;
};

type FeatureFlagMiddlewareResult = (
  req: Request,
  res: Response,
  next: () => void
) => void;

export const featureFlagMiddleware = ({
  featureFlagService,
}: FeatureFlagMiddlewareInput): FeatureFlagMiddlewareResult => async (
  req,
  res,
  next
) => {
  const {
    [`flag-name`]: flagName,
    [`default-value`]: defaultValue,
  } = req.query;

  const featureFlagValue = await featureFlagService.fetchFeatureFlag({
    flagName,
    options: { defaultValue },
  });

  if (featureFlagValue) {
    return next();
  }

  res.status(404).send('Not Found');
};
