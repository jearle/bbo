import { mocked } from 'ts-jest/utils';
import dbs from '../../src/dbs';
import CompanyProfile, {
	IReturnPlayerDetailCompanyAddress,
	IReturnPlayerDetailCompanyBullet,
	IReturnPlayerDetailCompanyInfo,
} from '../../src/models/company-profile';

const dbsMocked = mocked(dbs, true);

jest.mock('../../src/dbs');

describe('company-profile', () => {
	describe('findByUuid()', () => {
		const infos: IReturnPlayerDetailCompanyInfo[] = [{}];
		const addresses: IReturnPlayerDetailCompanyAddress[] = [{}];
		const bullets: IReturnPlayerDetailCompanyBullet[] = [
			{
				Bullet_id: 1,
				Bullet_tx: 't',
				Company_id: 1,
			},
		];
		let execute = jest.fn();
		beforeEach(() => {
			jest.spyOn(dbs, 'get').mockImplementation(() => {
				execute = jest.fn().mockResolvedValue({
					recordsets: [infos, addresses, bullets],
				});
				return Promise.resolve({
					rcaweb: {
						request: jest.fn().mockReturnValue({
							input: jest.fn().mockReturnValue({
								execute,
							}),
						}),
					},
				}) as any;
			});
		});
		it('uses rcaweb database', async () => {
			await CompanyProfile.findByUuid('');
			expect(dbsMocked.get).toHaveBeenCalled();
		});

		it('runs ReturnPlayerDetail_newPTS stored procedured with company guid', async () => {
			const guid = '5d8ffc44-6481-4f08-9815-fec21fa406a0';
			await CompanyProfile.findByUuid(guid);
			expect(execute).toHaveBeenCalledWith('ReturnPlayerDetail_newPTS');
		});

		it('returns info, addresses, and bullets', async () => {
			const guid = '5d8ffc44-6481-4f08-9815-fec21fa406a0';
			const result = await CompanyProfile.findByUuid(guid);
			expect(result).toEqual({
				addresses,
				bullets,
				infos,
			});
		});
	});
});
