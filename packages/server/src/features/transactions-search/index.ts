import {
  createTransactionsSearchService,
  TransactionsSearchService,
} from './services/transactions-search';
import { createApp, BASE_PATH, DESCRIPTION } from './apps/transactions-search';
import { createPropertyTypeService } from '../property-type/services/property-type';
import { createElasticsearchProvider } from '../../providers/elasticsearch';
import { createMSSQLProvider } from '../../providers/mssql';
import { createRedisProvider } from '../../providers/redis';

export type TransactionsSearchFeatureOptions = {
  readonly redisURI: string;
  readonly mssqlURI: string;
  readonly node: string;
  readonly username: string;
  readonly password: string;
};

type TransactionsSearchFeatureInputs = {
  readonly transactionsSearchService: TransactionsSearchService;
};

const transactionsSearchFeature = ({
  transactionsSearchService,
}: TransactionsSearchFeatureInputs) => ({
  transactionsSearchBasePath: BASE_PATH,
  transactionsSearchDescription: DESCRIPTION,

  transactionsSearchApp() {
    return createApp({ transactionsSearchService });
  },
});

type TransactionsSearchFeature = ReturnType<typeof transactionsSearchFeature>;

export const createTransactionsSearchFeature = async ({
  mssqlURI,
  redisURI,
  username,
  password,
  node,
}: TransactionsSearchFeatureOptions): Promise<TransactionsSearchFeature> => {
  const mssqlProvider = await createMSSQLProvider({ uri: mssqlURI });
  const redisProvider = await createRedisProvider({ uri: redisURI });
  const propertyTypeService = await createPropertyTypeService({
    mssqlProvider,
    redisProvider,
  });

  const elasticsearchProvider = createElasticsearchProvider({
    node,
    username,
    password,
  });
  const transactionsSearchService = createTransactionsSearchService({
    elasticsearchProvider,
    propertyTypeService,
  });

  return transactionsSearchFeature({ transactionsSearchService });
};
