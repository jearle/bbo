import { createApp } from './';
import { TransactionsService } from './services/transactions';
import { testHealthcheck } from '../../helpers/unit/healthcheck';
import MockLDClient from '../../services/launchdarkly/launchdarkly.mock';

const transactionsService: TransactionsService = {
  search() {
    return [];
  },
};

const launchDarklyClient = new MockLDClient();
test(`healthcheck`, async () => {
  await testHealthcheck(createApp({ transactionsService, launchDarklyClient }));
});
