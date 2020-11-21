import { createRcaWebAccountsService } from '.';

const { MSSQL_URI: uri } = process.env;

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
