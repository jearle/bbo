import { UserStore } from '../user-store';
import { createInitiateAuth } from './initiate-auth';
// import { createSignUp } from './sign-up';

type CreateHandlersFeatureInput = {
  readonly userStore: UserStore;
};

type HandlersFeatureInput = CreateHandlersFeatureInput;

const handlersFeature = ({ userStore }: HandlersFeatureInput) => ({
  handlers: {
    initiateAuth: createInitiateAuth({ userStore }),
    // signUp: createSignUp({ userStore }),
  },
});

export type HandlersFeature = ReturnType<typeof handlersFeature>;

export const createHandlersFeature = ({
  userStore,
}: CreateHandlersFeatureInput): HandlersFeature => {
  return handlersFeature({ userStore });
};
