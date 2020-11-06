import mssql from 'mssql';
import { createRCAWebService } from '.';

const { RCA_WEB_URI: uri } = process.env;

describe(`rca web service`, () => {
  let rcaWebService = null;

  beforeAll(async () => {
    rcaWebService = await createRCAWebService({
      uri,
    });
  });

  afterAll(async () => {
    await rcaWebService.close();
  });

  test(`returns types`, () => {
    expect(rcaWebService.types().Int).not.toBeUndefined();
    // expect(rcaWebService.types().Int).not.toBeNull();
  });
});
