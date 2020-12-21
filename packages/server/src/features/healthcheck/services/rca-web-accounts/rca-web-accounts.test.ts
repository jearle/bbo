import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRCAWebAccountsHealthService } from './';

const { MSSQL_URI } = process.env;

test('healthy rcaWebAccounts health service', async () => {
  const healthService = await createRCAWebAccountsHealthService({
    mssqlProvider: await createMSSQLProvider({ uri: MSSQL_URI }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(0);
});

test('unhealthy rcaWebAccounts health service', async () => {
  const healthService = await createRCAWebAccountsHealthService({
    mssqlProvider: await createMSSQLProvider({
      uri: 'mssql://SiteAdmin:___WRONG_PASSWORD___@172.31.31.53',
    }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});
