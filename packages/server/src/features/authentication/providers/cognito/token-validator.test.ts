import { createTokenValidator, TokenValidator } from './token-validator';

const { COGNITO_REGION, COGNITO_USER_POOL_ID } = process.env;

const createTokenValidatorInput = {
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: `access`,
  maxAge: 3600,
};

const EXPIRED_TOKEN = `eyJraWQiOiJaeWxiRk1FNml2dmxUa2JmcUJtV0paeTYxN1IxTm82bG1vQXREa24reVdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMjc5MTg2YS0wZGQ4LTQ3NjUtYmU5Ny0zYzJlMWZjMTE1YWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzM3Mjk5ZjI2LTAzOGQtNGJiNC1iMzBkLWE5ZTAzOTMwMjcxMSIsImV2ZW50X2lkIjoiNmUwZjNlNDAtMjcxMy00NGI1LTk4ZjItZWZhMTU5OTk5ZGY5IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTYwNTE5NDgwNCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfUnBNTmZobEZnIiwiZXhwIjoxNjA1MTk4NDA0LCJpYXQiOjE2MDUxOTQ4MDUsImp0aSI6IjlkN2I3OGE0LTRhMmYtNDliMS1iY2U1LWFkYzA4OWQ0YjU5YSIsImNsaWVudF9pZCI6Im11bXRjYjVhbnJubGVtaW9ucHFlanFmNGgiLCJ1c2VybmFtZSI6ImplYXJsZUByY2FuYWx5dGljcy5jb20ifQ.BBpDtsJAnUdxBtzxw7IfmAFXZQeY3VQmhUo434mLMb-cGvPOYTJMDyjmi_Fd3oz0PSvfQzQp1X4CxD75dCvxLEBHlX4uMop9W2KOrQxjB0mbZLaaIzt8gDvsTvVD5_VTCnNMtz_B8FHxhWLxGAxiSpX8GsyarpczN8aQnT2jkxYkgr1tXfSZfVGyoxe4bXZ44KMeYndi8tJ44bUcTzeUC_UDmRR5zleFIvlYtjOwmY4JOADN27zlG45IoIDH-3mJktXFr61HG3gGdMLBu-rSsxz8jjT7wGzqX_wVYehD82uIANCsu6lZw9yTtH_YBRopG1aWHtmg6IG8XDqSMp1ARw`;
const INVALID_KID_TOKEN = `eyJraWQiOiJiYWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhMjc5MTg2YS0wZGQ4LTQ3NjUtYmU5Ny0zYzJlMWZjMTE1YWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzM3Mjk5ZjI2LTAzOGQtNGJiNC1iMzBkLWE5ZTAzOTMwMjcxMSIsImV2ZW50X2lkIjoiNmUwZjNlNDAtMjcxMy00NGI1LTk4ZjItZWZhMTU5OTk5ZGY5IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTYwNTE5NDgwNCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfUnBNTmZobEZnIiwiZXhwIjoxNjA1MTk4NDA0LCJpYXQiOjE2MDUxOTQ4MDUsImp0aSI6IjlkN2I3OGE0LTRhMmYtNDliMS1iY2U1LWFkYzA4OWQ0YjU5YSIsImNsaWVudF9pZCI6Im11bXRjYjVhbnJubGVtaW9ucHFlanFmNGgiLCJ1c2VybmFtZSI6ImplYXJsZUByY2FuYWx5dGljcy5jb20ifQ.BBpDtsJAnUdxBtzxw7IfmAFXZQeY3VQmhUo434mLMb-cGvPOYTJMDyjmi_Fd3oz0PSvfQzQp1X4CxD75dCvxLEBHlX4uMop9W2KOrQxjB0mbZLaaIzt8gDvsTvVD5_VTCnNMtz_B8FHxhWLxGAxiSpX8GsyarpczN8aQnT2jkxYkgr1tXfSZfVGyoxe4bXZ44KMeYndi8tJ44bUcTzeUC_UDmRR5zleFIvlYtjOwmY4JOADN27zlG45IoIDH-3mJktXFr61HG3gGdMLBu-rSsxz8jjT7wGzqX_wVYehD82uIANCsu6lZw9yTtH_YBRopG1aWHtmg6IG8XDqSMp1ARw`;
const BAD_ISSUER = `eyJraWQiOiJaeWxiRk1FNml2dmxUa2JmcUJtV0paeTYxN1IxTm82bG1vQXREa24reVdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMjc5MTg2YS0wZGQ4LTQ3NjUtYmU5Ny0zYzJlMWZjMTE1YWEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzM3Mjk5ZjI2LTAzOGQtNGJiNC1iMzBkLWE5ZTAzOTMwMjcxMSIsImV2ZW50X2lkIjoiNmUwZjNlNDAtMjcxMy00NGI1LTk4ZjItZWZhMTU5OTk5ZGY5IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTYwNTE5NDgwNCwiaXNzIjoiaHR0cHM6Ly9iYWQuY29tL3VzLWVhc3QtMV9ScE1OZmhsRmciLCJleHAiOjE2MDUxOTg0MDQsImlhdCI6MTYwNTE5NDgwNSwianRpIjoiOWQ3Yjc4YTQtNGEyZi00OWIxLWJjZTUtYWRjMDg5ZDRiNTlhIiwiY2xpZW50X2lkIjoibXVtdGNiNWFucm5sZW1pb25wcWVqcWY0aCIsInVzZXJuYW1lIjoiamVhcmxlQHJjYW5hbHl0aWNzLmNvbSJ9.BBpDtsJAnUdxBtzxw7IfmAFXZQeY3VQmhUo434mLMb-cGvPOYTJMDyjmi_Fd3oz0PSvfQzQp1X4CxD75dCvxLEBHlX4uMop9W2KOrQxjB0mbZLaaIzt8gDvsTvVD5_VTCnNMtz_B8FHxhWLxGAxiSpX8GsyarpczN8aQnT2jkxYkgr1tXfSZfVGyoxe4bXZ44KMeYndi8tJ44bUcTzeUC_UDmRR5zleFIvlYtjOwmY4JOADN27zlG45IoIDH-3mJktXFr61HG3gGdMLBu-rSsxz8jjT7wGzqX_wVYehD82uIANCsu6lZw9yTtH_YBRopG1aWHtmg6IG8XDqSMp1ARw`;

describe(`tokenValidator`, () => {
  let tokenValidator: TokenValidator;

  beforeAll(async () => {
    tokenValidator = await createTokenValidator(createTokenValidatorInput);
  });

  test(`createCognitoService bad config`, () => {
    const badConfigs = [
      { region: null },
      { userPoolId: null },
      { tokenUse: null },
      { maxAge: null },
    ];

    badConfigs.forEach(async (config) => {
      const [key] = Object.keys(config);

      const badConfig = {
        ...createTokenValidatorInput,
        ...config,
      };

      try {
        await createTokenValidator(badConfig);
      } catch (e) {
        expect(e.message).toMatch(new RegExp(key));
      }
    });
  });

  test(`validate invalid`, async () => {
    try {
      await tokenValidator.validate({
        token: ``,
      });
    } catch (e) {
      expect(e.message).toMatch(/invalid/i);
    }
  });

  test(`validate expired`, async () => {
    try {
      await tokenValidator.validate({
        token: EXPIRED_TOKEN,
      });
    } catch (e) {
      expect(e.message).toMatch(/expired/i);
    }
  });

  test(`validate bad token use`, async () => {
    const tokenValidatorBadTokenUse = await createTokenValidator({
      ...createTokenValidatorInput,
      tokenUse: `broken`,
    });

    try {
      await tokenValidatorBadTokenUse.validate({
        token: EXPIRED_TOKEN,
      });
    } catch (e) {
      expect(e.message).toMatch(/token use/i);
    }
  });

  test(`validate bad pem`, async () => {
    try {
      await tokenValidator.validate({
        token: INVALID_KID_TOKEN,
      });
    } catch (e) {
      expect(e.message).toMatch(/pem/i);
    }
  });

  test(`validate bad issuer`, async () => {
    try {
      await tokenValidator.validate({
        token: BAD_ISSUER,
      });
    } catch (e) {
      expect(e.message).toMatch(/issuer/i);
    }
  });
});
