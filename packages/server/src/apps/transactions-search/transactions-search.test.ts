import { createApp } from './';
import { TransactionsService } from './services/transactions';
import { testHealthcheck } from '../../helpers/unit/healthcheck';

const transactionsService: TransactionsService = {
  search() {
    return [];
  },
};

test(`healthcheck`, async () => {
  await testHealthcheck(createApp({ transactionsService }));
});
