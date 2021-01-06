import { createHmac } from 'crypto';

type HashSecretInput = {
  username: string;
  appClientId: string;
  appClientSecret: string;
};

export const hashSecret = ({
  username,
  appClientId,
  appClientSecret,
}: HashSecretInput): string => {
  return createHmac('SHA256', appClientSecret)
    .update(`${username}${appClientId}`)
    .digest('base64');
};
