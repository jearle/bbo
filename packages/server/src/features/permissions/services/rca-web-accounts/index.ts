import {
  RawPermissionsModel,
  PermissionsModel,
  createPermissionsModelFromList,
} from './permissions-model';
import { MSSQLProvider } from '../../providers/mssql';

const DATABASE = `dbRCAWebAccounts`;
const STORED_PROCEDURE = `ReturnStateProvAndCountryPTsByUser_New_PTSMenu`;

type FetchPermissionModelsInput = {
  readonly userId: string;
};

type FetchUserIdInput = {
  readonly username: string;
}

type CreateRCAWebAccountsServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const rcaWebAccountsService = ({
  mssqlProvider,
  rcaWebAccountsConnection,
}) => ({
  async fetchPermissionsModel({
    userId,
  }: FetchPermissionModelsInput): Promise<PermissionsModel> {
    const result = await rcaWebAccountsConnection
      .request()
      .input(`AccountUser_id`, mssqlProvider.types().Int, userId)
      .execute(STORED_PROCEDURE);

    const [permissionsModel]: [RawPermissionsModel[]] = result.recordsets;

    return createPermissionsModelFromList(permissionsModel);
  },

  async fetchUserId({
    username, 
  }: FetchUserIdInput): Promise<string> {
    const result = await rcaWebAccountsConnection
      .request()
      .input(`username`, mssqlProvider.types().NVarChar, username)
      .query('SELECT [AccountUser_Id] AS userId FROM [dbRCAWebAccounts].[dbo].[AccountUser] WHERE [Email_tx] = @username');

    return result.recordset[0].userId;
  }, 

  async close() {
    await rcaWebAccountsConnection.close();
  },
});

export type RCAWebAccountsService = ReturnType<typeof rcaWebAccountsService>;

export const createRCAWebAccountsService = async ({
  mssqlProvider,
}: CreateRCAWebAccountsServiceInput): Promise<RCAWebAccountsService> => {
  const rcaWebAccountsConnection = await mssqlProvider.connect({
    database: DATABASE,
  });

  return rcaWebAccountsService({ mssqlProvider, rcaWebAccountsConnection });
};
