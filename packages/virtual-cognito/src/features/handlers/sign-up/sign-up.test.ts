import { createSignUp } from '.';
import { createUserStoreFeature } from '../../user-store';

const DEFAULT_USERNAME = `test@rcanalytics.com`;
const DEFAULT_PASSWORD = `=Z9-xW%7`;

describe(`signUp`, () => {
  const { userStore } = createUserStoreFeature();
  const signUp = createSignUp({ userStore });

  test(`signUp success`, async () => {
    const request = {
      body: {
        Username: DEFAULT_USERNAME,
        Password: DEFAULT_PASSWORD,
      },
    };

    const { body } = await signUp(request);
    const { Destination: destination } = body.CodeDeliveryDetails;

    expect(destination).toBe(`t***@r***.com`);
  });
});
