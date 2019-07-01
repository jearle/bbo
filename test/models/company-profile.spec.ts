import { mocked } from 'ts-jest/utils';
import dbs, { IDbs } from '../../src/dbs';
import CompanyProfile from '../../src/models/company-profile';
import { setupMockDbs } from '../spec-helper';

const dbsMocked = mocked(dbs, true);

jest.mock('../../src/dbs');

describe('company-profile', () => {
	// tslint:disable-next-line:no-shadowed-variable
	let dbs: IDbs;
	beforeEach(() => {
		dbs = setupMockDbs();
		dbsMocked.get.mockImplementation(() => dbs);
	});

	describe('findByUuid()', () => {
		it('uses rcaweb database', async () => {
			await CompanyProfile.findByUuid('');
			expect(dbsMocked.get).toHaveBeenCalled();
		});

		// it('inputs Company_id unique identifier', async () => {
		// 	await CompanyProfile.findByUuid('');
		// 	expect(dbs.rcaweb.request).toHaveBeenCalled();
		// 	expect(dbs.rcaweb.input).toHaveBeenCalled();
		// });

		// it('calls stored ReturnPlayerDetail_newPTS', async () => {});

		// it('returns info, addresses, and bullets', async () => {});
	});
});
