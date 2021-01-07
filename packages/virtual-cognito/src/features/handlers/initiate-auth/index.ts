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
  readonly ClientId: string;
  readonly AuthParameters: BodyAuthParameters;
};

type CredentialsFromBodyResult = {
  readonly username: string;
  readonly password: string;
  readonly clientId: string;
};

type CreateInitiateAuthInput = {
  readonly userStore: UserStore;
};

const credentialsFromBody = (
  body: CredentialsFromBodyInput
): CredentialsFromBodyResult => {
  const {
    ClientId: clientId,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  } = body;

  return { username, password, clientId };
};

export const createInitiateAuth = ({
  userStore,
}: CreateInitiateAuthInput) => async ({
  body,
}: Request): Promise<LoginResponse> => {
  const { username, password, clientId } = credentialsFromBody(body);

  const validatedUser = userStore.getValidatedUser({ username, password });

  if (validatedUser.isInvalid) return createLoginFailure();

  const loginSuccess = await createLoginSuccess({
    expired: clientId === `expired`,
    badIssuer: clientId === `bad-issuer`,
    badTokenUse: clientId === `bad-token-use`,
    badToken: clientId === `bad-token`,
    badKid: clientId === `bad-kid`,
  });

  return loginSuccess;
};
