import {
  targetHandlerMiddleware,
  Handlers,
} from './middlewares/target-handler';

type TargetFeatureInput = {
  handlers: Handlers;
};

type CreateTargetFeatureInput = TargetFeatureInput;

const targetFeature = ({ handlers }: TargetFeatureInput) => ({
  targetFeatureMiddleware() {
    return targetHandlerMiddleware({ handlers });
  },
});

type TargetFeature = ReturnType<typeof targetFeature>;

export const createTargetFeature = ({
  handlers,
}: CreateTargetFeatureInput): TargetFeature => {
  return targetFeature({ handlers });
};
