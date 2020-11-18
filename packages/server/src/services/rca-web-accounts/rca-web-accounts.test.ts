import mssql from 'mssql';
import { createRcaWebAccountsService } from '.';

const { RCA_WEB_ACCOUNTS_URI: uri } = process.env;

describe(`rca web service`, () => {
  let rcaWebAccountsService = null;

  beforeAll(async () => {
    rcaWebAccountsService = await createRcaWebAccountsService({
      uri,
    });
  });

  afterAll(async () => {
    await rcaWebAccountsService.close();
  });

  test(`returns types`, () => {
    expect(rcaWebAccountsService.types().Int).not.toBeUndefined();
    // expect(rcaWebAccountsService.types().Int).not.toBeNull();
  });
});
