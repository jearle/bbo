import { Request } from 'express';
import {
  createSignUpFailure,
  createSignUpSuccess,
  SignUpResponse,
} from './responses';
import { UserStore } from '../../user-store';

type CreateSignUpInput = {
  readonly userStore: UserStore;
};

export const createSignUp = ({ userStore }: CreateSignUpInput) => async ({
  body,
}: Request): Promise<SignUpResponse> => {
  const { Username: username, Password: password } = body;

  try {
    userStore.createUser({ username, password });

    return createSignUpSuccess({ username });
  } catch (error) {
    return createSignUpFailure();
  }
};
