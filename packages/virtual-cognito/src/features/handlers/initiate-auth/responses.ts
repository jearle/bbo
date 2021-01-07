import { sign } from 'jsonwebtoken';
import { readFile } from 'fs/promises';

type Data = {
  readonly error: string;
};

type AuthenticationData = {
  readonly AccessToken: string;
  readonly RefreshToken: string;
  readonly IdToken: string;
  readonly ExpiresIn: number;
  readonly TokenType: string;
};

export type LoginSuccess = {
  readonly AuthenticationResult: AuthenticationData;
};

export type LoginFailure = {
  readonly data: Data;
};

export type LoginResponse = {
  readonly statusCode: number;
  readonly body: any; // eslint-disable-line
};

const createBodyJSON = ({
  times: { authorizationTime, expiration },
  issuer: iss,
  tokenUse: token_use,
}) => {
  return {
    iss,
    token_use,
    client_id: 'mumtcb5anrnlemionpqejqf4h',
    device_key: 'us-east-1_0461acef-636a-4b7e-bc53-3b5680372dd9',
    event_id: '5340ce3e-1472-44a9-bd71-51907c1353ce',
    jti: 'b15d8cde-a0f2-434a-b07e-f95d4eff0bbd',
    scope: 'aws.cognito.signin.user.admin',
    sub: '84756f8f-dcac-4267-b1c3-398765d84061',
    username: 'jearle@rcanalytics.com',
    auth_time: authorizationTime,
    iat: authorizationTime,
    exp: expiration,
  };
};

const getTimes = ({ expired }) => {
  const authorizationTime = Math.floor(new Date().getTime() / 1000);
  const anHourAgo = authorizationTime - 3601;
  const anHourLater = authorizationTime + 3600;

  return {
    authorizationTime,
    expiration: expired ? anHourAgo : anHourLater,
  };
};

const getIssuer = ({ badIssuer }) => {
  if (badIssuer) return `http://bad-issuer`;

  return `http://${process.env.HOST}:${process.env.PORT}`;
};

const getTokenUse = ({ badTokenUse }) => {
  if (badTokenUse) return `bad_use`;

  return `access`;
};

const getKid = ({ badKid }) => {
  if (badKid) return `bad-kid`;

  return `ZylbFME6ivvlTkbfqBmWJZy617R1No6lmoAtDkn+yWE=`;
};

const createAccessToken = async ({
  expired,
  badIssuer,
  badTokenUse,
  badKid,
}) => {
  const bodyJSON = createBodyJSON({
    times: getTimes({ expired }),
    issuer: getIssuer({ badIssuer }),
    tokenUse: getTokenUse({ badTokenUse }),
  });

  const keysDir = `${__dirname}/../../../../keys`;

  const privateKey = await readFile(`${keysDir}/private.key`, `utf8`);

  const accessToken = sign(bodyJSON, privateKey, {
    header: {
      kid: getKid({ badKid }),
      alg: `RS256`,
    },
    algorithm: `RS256`,
  });

  return accessToken;
};

const createBody = async ({
  expired,
  badIssuer,
  badTokenUse,
  badToken,
  badKid,
}) => {
  const accessToken = await createAccessToken({
    expired,
    badIssuer,
    badTokenUse,
    badKid,
  });

  const body = {
    ChallengeParameters: {},
    AuthenticationResult: {
      AccessToken: badToken
        ? accessToken.substr(0, accessToken.length - 1)
        : accessToken,
      RefreshToken:
        'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.OmEuFpipqivCQNaR7yyquaq2S8kbERm8HpWzcaqKtVd3G9-u5RWRkviEqNdawrvt-c20tul8OLN2xczgJG7Q642P6Zk7tiW-LOxSiHjGNie6zpooJwLKgFTdtZhUnfr5n13phi56Umr4V78Cx4XoOSCqHwYpr7h9Jiic5Jm8dO6nB6kxhyQyBPdkehls_uDNIEKY2qd-bDZqfmBkW1NL3D739gDiG2k7Z5rbPcPGmLvyo5Ua-p_grrQPd4poCXzJAcIZXsbzItRsOlQELpKIQMTWTSR64IzbU6UZhxTc82_ms490C2pdlh3WGOcx8tLNVWJaxn0eVXzVP0lA3DR43w.Z7ngcUY-pr6pYonv.iYAAhHZQiThoHnN9KFTOXDoJ3cVfkosvMNIbZmhGP-FaAPl_heCvPQpCYMh_D93dAP27hH0NfFKYzCUaxAYqUO3cmyM-7aiYpP-F31nB_sm3uVGfccFcsTcV2WWJq59byz3E-1YHvePmR_DeEIxTAfyPCzmf6koXOyFahfOtUDZ70YL3XCMZKZGxn-DO6K4vvysZzePCclceb6gZ_MGU0_ZBSAk1GqdffrxeWuWSvPBDL_BllVJKH1Nw2azuT7JONGlRl3RvpO2JrmXJKlnKKrhzh6fM3uINbOYFNhH7dJmArnhDkAIu6zZFG5wo4kMofUtRTasPSXST5FWneaPB-caJJMZa_EuiLUuiZ_0ynGMyiN0Q4fMm8xpjKeklii5C1vbmGugMsW2EDXbS7ImMZfOuS6XFsPC6gnxF2buUp03FCld5Hmrir-VgV2cmlBSfgSpVaGmOev7AGUwNv10ot6O3EtYpzyuryzFRYFd6K2s5pXp4ZlDBgM2NyR4VtkDfhfxbOWdpAkdeyGddhxWQxaUmTcO4D63QFwJRG_GihvQzHr-O1JZQj5MmJoDzhp50xYPA1i7lEL2B17qexbxpcxuvEISsWkg0_ZpyHlzDr6x41SLfkAsdWSb8KaBrvA8V5nwOyxFH3An69C9GIsB677D-fu_jSSsn9_NUEKFsl1GkIkdtI_i_qbBsejN3QPAC-kN-N1fijBhegt0mS4xa8AmriZoQZNF0c0jQA9CqpEbfTe6JADT4rW1-wfg1kA8Wz7m9xScJltavtU_Ruflm-oZ0nhvLuRjDb2qoVf3nsswCFdpHKrcmmZCYgLsG85C6pWHOe7V2F5F-dLILwhoJxRz3Oy_yDzXLSOZ9tzi3No5n1NDXKmw_95gXCNWRB2sFfQ51A19roNwVwCCDDav_G3HhCq3rpFqQFeG1xwsXtG6Buw2FIu86BgfJWpHIw_PThbDvojak9DKblEzcneZGRynoLsr5vO4F7c33DBLRNR8g3CrRLGvdMsO4SO-X7l6hzrXL9b_TiSS248IJ8mJ9yOlYeyxEDyiLEB5poNrvbnWIRtlKngWF8ff6Urn6RvVRAw3hY4LF2Ar1vYtyVvCx25Fp9R_rlpFwJsU7YJKItLhl4xOhiw22_rSP0EyQ0zQwmoHAnFSApXdKmO_ckRNLbBmeHnTtnr_JGn21tAC3zAfjAA1saMnJ_3PSbSq7gzxHzZ-vf7pGMx-bixRbmduIStcGybGhgfrPiDNOwSCoDF_2HyW73A7BIl1PUXezeB-e4hGGSnqHkeYEqgD2G94gxJWcKols8bHKHpu9FIPUEW6oL6lNj3QesxnZSxKWGlv8L1NQ2CCh3eax69TIUC7wuIpc6Y9oVb6K4GoSKdCZnZLgdp-tq6ExQZZIO59wWwazi3viUsnq3rJhVA.GSGWEKRCoX1aXKs4mu-nzQ',
      IdToken:
        'eyJraWQiOiI4XC9uTXI3MHBXYVcrTHl0dGZCVVpCTGdSc3ZJV3N0VVFSRTN6dmNiMjJUMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4NDc1NmY4Zi1kY2FjLTQyNjctYjFjMy0zOTg3NjVkODQwNjEiLCJhdWQiOiJtdW10Y2I1YW5ybmxlbWlvbnBxZWpxZjRoIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNTM0MGNlM2UtMTQ3Mi00NGE5LWJkNzEtNTE5MDdjMTM1M2NlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDgwNzMwMTcsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1JwTU5maGxGZyIsImNvZ25pdG86dXNlcm5hbWUiOiJqZWFybGVAcmNhbmFseXRpY3MuY29tIiwiZXhwIjoxNjA4MDc2NjE3LCJpYXQiOjE2MDgwNzMwMTcsImVtYWlsIjoiamVhcmxlQHJjYW5hbHl0aWNzLmNvbSJ9.aRDS8kHO2sv98s7ucDTdWrOusY17WXCf7MlD5gpKTACGfobRYpweqriTQuT8RXh1ucfpJVwo-bV8QAXXVHEmJwc4jgZUZ8CORnYwge9FMf6SK3A3YBCxzbGAwz1ub8P3Yy0C3f0HM_yIyBGrVMZ_nuzhhnFmgNDCl4U_jc08yDj-0WisXC17tC5M--GSOwH0bN7Lzea-A7vu1DP7fUramlAsiA4QJ1e2BRnzmbhkTnG8Pey7s1WjRuKaumZvUqHPAD13JX4EsgHvpufxEVaXFN2fll8p-F0Qo7DpVH3Etpjj6fiGb3QWRyIOGzskxV-tEZjZOg49EhkqngUg5WewzQ',
      ExpiresIn: 3600,
      TokenType: 'Bearer',
    },
  };

  return body;
};

type CreateLoginSuccessInput = {
  readonly expired: boolean;
  readonly badIssuer: boolean;
  readonly badTokenUse: boolean;
  readonly badToken: boolean;
  readonly badKid: boolean;
};

export const createLoginSuccess = async ({
  expired,
  badIssuer,
  badTokenUse,
  badToken,
  badKid,
}: CreateLoginSuccessInput): Promise<LoginResponse> => {
  return {
    statusCode: 200,
    body: await createBody({
      expired,
      badIssuer,
      badTokenUse,
      badToken,
      badKid,
    }),
  };
};

export const createLoginFailure = (): LoginResponse => ({
  statusCode: 400,
  body: JSON.parse(`
    {
      "__type":"NotAuthorizedException",
      "message":"Incorrect username or password."
    }
  `),
});
