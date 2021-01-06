import { hashSecret } from '.';
import { CREDENTIALS, COGNITO_CONFIG } from '../test/data';

const { username } = CREDENTIALS;
const { appClientId, appClientSecret } = COGNITO_CONFIG;

test(`hashSecret`, () => {
  const secret = hashSecret({
    username,
    appClientId,
    appClientSecret,
  });

  expect(secret.length).toBeGreaterThan(0);
});
