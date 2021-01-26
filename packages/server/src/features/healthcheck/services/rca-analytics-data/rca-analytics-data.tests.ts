import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRCAAnalyticsDataHealthService } from './';

const { ANALYTICSDATA_MSSQL_URI } = process.env;

test('healthy rcaAnalyticsData health service', async () => {
  const healthService = await createRCAAnalyticsDataHealthService({
    mssqlProvider: await createMSSQLProvider({ uri: ANALYTICSDATA_MSSQL_URI }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(0);
});

test('unhealthy rcaAnalyticsData health service', async () => {
  const healthService = await createRCAAnalyticsDataHealthService({
    mssqlProvider: await createMSSQLProvider({
      uri: 'mssql://SiteAdmin:___WRONG_PASSWORD___@172.31.31.53',
    }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});
