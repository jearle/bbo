import { createMSSQLProvider } from '.';

const { MSSQL_URI: uri } = process.env;
const DATABASE = `dbRCAWebAccounts`;

test(`createMSSQLProvider`, async () => {
  const mssqlProvider = createMSSQLProvider({
    uri,
  });

  const connection = await mssqlProvider.connect({ database: DATABASE });

  await connection.close();
});

test(`MSSQLProvider#types`, async () => {
  const mssqlProvider = createMSSQLProvider({
    uri,
  });

  expect(mssqlProvider.types().Int).not.toBeUndefined();
});
