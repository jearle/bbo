import { Request } from 'express';
import {
  LoginResponse,
  createLoginSuccess,
  createLoginFailure,
} from './responses';
import { UserStore } from '../../user-store';

type BodyAuthParameters = {
  readonly USERNAME: string;
  readonly PASSWORD: string;
};

type CredentialsFromBodyInput = {
  readonly AuthParameters: BodyAuthParameters;
};

type CredentialsFromBodyResult = {
  readonly username: string;
  readonly password: string;
};

type CreateInitiateAuthInput = {
  readonly userStore: UserStore;
};

const credentialsFromBody = (
  body: CredentialsFromBodyInput
): CredentialsFromBodyResult => {
  const {
    AuthParameters: { USERNAME: username, PASSWORD: password },
  } = body;

  return { username, password };
};

export const createInitiateAuth = ({
  userStore,
}: CreateInitiateAuthInput) => async ({
  body,
}: Request): Promise<LoginResponse> => {
  const { username, password } = credentialsFromBody(body);

  const validatedUser = userStore.getValidatedUser({ username, password });

  if (validatedUser.isInvalid) return createLoginFailure();

  const loginSuccess = await createLoginSuccess();

  return loginSuccess;
};
