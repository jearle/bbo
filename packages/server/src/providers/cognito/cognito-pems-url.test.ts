import { createCognitoPemsURL } from './cognito-pems-url';

const { COGNITO_REGION, COGNITO_USER_POOL_ID } = process.env;

test(`createCognitoPemsURL`, () => {
  const url = createCognitoPemsURL({
    region: COGNITO_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
  });

  expect(url.length).toBeGreaterThan(0);
});

test(`createCognitoPemsURL invalid region`, () => {
  try {
    createCognitoPemsURL({
      region: ``,
      userPoolId: COGNITO_USER_POOL_ID,
    });
  } catch (e) {
    expect(e.message).toMatch(/region/i);
  }
});

test(`createCognitoPemsURL invalid userPoolId`, () => {
  try {
    createCognitoPemsURL({
      region: COGNITO_REGION,
      userPoolId: ``,
    });
  } catch (e) {
    expect(e.message).toMatch(/userPoolId/i);
  }
});
