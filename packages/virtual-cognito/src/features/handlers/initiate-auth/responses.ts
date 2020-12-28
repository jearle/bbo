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

const createAccessToken = () => {
  const token = `eyJraWQiOiJaeWxiRk1FNml2dmxUa2JmcUJtV0paeTYxN1IxTm82bG1vQXREa24reVdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NDc1NmY4Zi1kY2FjLTQyNjctYjFjMy0zOTg3NjVkODQwNjEiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzA0NjFhY2VmLTYzNmEtNGI3ZS1iYzUzLTNiNTY4MDM3MmRkOSIsImV2ZW50X2lkIjoiNTM0MGNlM2UtMTQ3Mi00NGE5LWJkNzEtNTE5MDdjMTM1M2NlIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTYwODA3MzAxNywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfUnBNTmZobEZnIiwiZXhwIjoxNjA4MDc2NjE3LCJpYXQiOjE2MDgwNzMwMTcsImp0aSI6ImIxNWQ4Y2RlLWEwZjItNDM0YS1iMDdlLWY5NWQ0ZWZmMGJiZCIsImNsaWVudF9pZCI6Im11bXRjYjVhbnJubGVtaW9ucHFlanFmNGgiLCJ1c2VybmFtZSI6ImplYXJsZUByY2FuYWx5dGljcy5jb20ifQ.cpy7ngK0hFPLs4geyftzpqcG_F2nrgQP_b85v38G023wjrzZsK-5rrfUaSBsfVA_yhzD2TSNVQSw4CPuFlPyF4hyGKUY2qpyWhj_rxeZsmMZO3VCPcOXMrc8ndPUV9ONfEEIONOuthfoIFNmx16vP9mi3GTkHwGiIf3TSuTdrf2i4Kk3UKLXXn0I8jsqU80FeoHgQOgtPi-gQtKpxL6trDgvk9MD620I9polAiIdtV_42IcBpD4gU-M1Qd8v691qzZ0BQsLC9YLNs_3bdJtLuOY7QPzezQybaPYiMZL-5jhAPSDiP-T1eWfa-zYZneXrE2YVxUP7N4sy2-9oY1sfiw`;
  const tokenParts = token.split(`.`);
  const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
  const twentyFourHours = 86400 * 1000;

  const newExpirationMilliseconds = new Date().getTime() + twentyFourHours;
  const newExpirationSeconds = newExpirationMilliseconds / 1000;

  payload.exp = newExpirationSeconds;

  const newPayload = Buffer.from(JSON.stringify(payload)).toString('base64');

  const accessToken = `${tokenParts[0]}.${newPayload}.${tokenParts[2]}`;
  console.log(accessToken);
  return accessToken;
};

export const createLoginSuccess = (): LoginResponse => ({
  statusCode: 200,
  body: JSON.parse(`
    {
      "ChallengeParameters": {},
      "AuthenticationResult": {
        "AccessToken": "${createAccessToken()}",
        "RefreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.OmEuFpipqivCQNaR7yyquaq2S8kbERm8HpWzcaqKtVd3G9-u5RWRkviEqNdawrvt-c20tul8OLN2xczgJG7Q642P6Zk7tiW-LOxSiHjGNie6zpooJwLKgFTdtZhUnfr5n13phi56Umr4V78Cx4XoOSCqHwYpr7h9Jiic5Jm8dO6nB6kxhyQyBPdkehls_uDNIEKY2qd-bDZqfmBkW1NL3D739gDiG2k7Z5rbPcPGmLvyo5Ua-p_grrQPd4poCXzJAcIZXsbzItRsOlQELpKIQMTWTSR64IzbU6UZhxTc82_ms490C2pdlh3WGOcx8tLNVWJaxn0eVXzVP0lA3DR43w.Z7ngcUY-pr6pYonv.iYAAhHZQiThoHnN9KFTOXDoJ3cVfkosvMNIbZmhGP-FaAPl_heCvPQpCYMh_D93dAP27hH0NfFKYzCUaxAYqUO3cmyM-7aiYpP-F31nB_sm3uVGfccFcsTcV2WWJq59byz3E-1YHvePmR_DeEIxTAfyPCzmf6koXOyFahfOtUDZ70YL3XCMZKZGxn-DO6K4vvysZzePCclceb6gZ_MGU0_ZBSAk1GqdffrxeWuWSvPBDL_BllVJKH1Nw2azuT7JONGlRl3RvpO2JrmXJKlnKKrhzh6fM3uINbOYFNhH7dJmArnhDkAIu6zZFG5wo4kMofUtRTasPSXST5FWneaPB-caJJMZa_EuiLUuiZ_0ynGMyiN0Q4fMm8xpjKeklii5C1vbmGugMsW2EDXbS7ImMZfOuS6XFsPC6gnxF2buUp03FCld5Hmrir-VgV2cmlBSfgSpVaGmOev7AGUwNv10ot6O3EtYpzyuryzFRYFd6K2s5pXp4ZlDBgM2NyR4VtkDfhfxbOWdpAkdeyGddhxWQxaUmTcO4D63QFwJRG_GihvQzHr-O1JZQj5MmJoDzhp50xYPA1i7lEL2B17qexbxpcxuvEISsWkg0_ZpyHlzDr6x41SLfkAsdWSb8KaBrvA8V5nwOyxFH3An69C9GIsB677D-fu_jSSsn9_NUEKFsl1GkIkdtI_i_qbBsejN3QPAC-kN-N1fijBhegt0mS4xa8AmriZoQZNF0c0jQA9CqpEbfTe6JADT4rW1-wfg1kA8Wz7m9xScJltavtU_Ruflm-oZ0nhvLuRjDb2qoVf3nsswCFdpHKrcmmZCYgLsG85C6pWHOe7V2F5F-dLILwhoJxRz3Oy_yDzXLSOZ9tzi3No5n1NDXKmw_95gXCNWRB2sFfQ51A19roNwVwCCDDav_G3HhCq3rpFqQFeG1xwsXtG6Buw2FIu86BgfJWpHIw_PThbDvojak9DKblEzcneZGRynoLsr5vO4F7c33DBLRNR8g3CrRLGvdMsO4SO-X7l6hzrXL9b_TiSS248IJ8mJ9yOlYeyxEDyiLEB5poNrvbnWIRtlKngWF8ff6Urn6RvVRAw3hY4LF2Ar1vYtyVvCx25Fp9R_rlpFwJsU7YJKItLhl4xOhiw22_rSP0EyQ0zQwmoHAnFSApXdKmO_ckRNLbBmeHnTtnr_JGn21tAC3zAfjAA1saMnJ_3PSbSq7gzxHzZ-vf7pGMx-bixRbmduIStcGybGhgfrPiDNOwSCoDF_2HyW73A7BIl1PUXezeB-e4hGGSnqHkeYEqgD2G94gxJWcKols8bHKHpu9FIPUEW6oL6lNj3QesxnZSxKWGlv8L1NQ2CCh3eax69TIUC7wuIpc6Y9oVb6K4GoSKdCZnZLgdp-tq6ExQZZIO59wWwazi3viUsnq3rJhVA.GSGWEKRCoX1aXKs4mu-nzQ",
        "IdToken": "eyJraWQiOiI4XC9uTXI3MHBXYVcrTHl0dGZCVVpCTGdSc3ZJV3N0VVFSRTN6dmNiMjJUMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4NDc1NmY4Zi1kY2FjLTQyNjctYjFjMy0zOTg3NjVkODQwNjEiLCJhdWQiOiJtdW10Y2I1YW5ybmxlbWlvbnBxZWpxZjRoIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNTM0MGNlM2UtMTQ3Mi00NGE5LWJkNzEtNTE5MDdjMTM1M2NlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDgwNzMwMTcsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1JwTU5maGxGZyIsImNvZ25pdG86dXNlcm5hbWUiOiJqZWFybGVAcmNhbmFseXRpY3MuY29tIiwiZXhwIjoxNjA4MDc2NjE3LCJpYXQiOjE2MDgwNzMwMTcsImVtYWlsIjoiamVhcmxlQHJjYW5hbHl0aWNzLmNvbSJ9.aRDS8kHO2sv98s7ucDTdWrOusY17WXCf7MlD5gpKTACGfobRYpweqriTQuT8RXh1ucfpJVwo-bV8QAXXVHEmJwc4jgZUZ8CORnYwge9FMf6SK3A3YBCxzbGAwz1ub8P3Yy0C3f0HM_yIyBGrVMZ_nuzhhnFmgNDCl4U_jc08yDj-0WisXC17tC5M--GSOwH0bN7Lzea-A7vu1DP7fUramlAsiA4QJ1e2BRnzmbhkTnG8Pey7s1WjRuKaumZvUqHPAD13JX4EsgHvpufxEVaXFN2fll8p-F0Qo7DpVH3Etpjj6fiGb3QWRyIOGzskxV-tEZjZOg49EhkqngUg5WewzQ",
        "ExpiresIn": 3600,
        "TokenType": "Bearer"
      }
    }
  `),
});

export const createLoginFailure = (): LoginResponse => ({
  statusCode: 400,
  body: JSON.parse(`
    {
      "__type":"NotAuthorizedException",
      "message":"Incorrect username or password."
    }
  `),
});
