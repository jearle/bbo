import { Server, ServerInjectOptions } from '@hapi/hapi';
import { mocked } from 'ts-jest/utils';
import CompanyBulletsController from '../../src/controllers/company-bullets-controller';
import CompanyProfile from '../../src/models/company-profile';
import { init } from '../../src/server';

jest.mock('../../src/models/company-profile');

const CompanyProfileMocked = mocked(CompanyProfile, true);

describe('company-highlights-controller', () => {
	let server: Server;

	beforeAll(async () => {
		server = await init();
	});

	afterAll(() => {
		server.stop();
	});

	const id = 'd356b54b-a01c-4aec-b41c-06e72f14a22c';
	const url = `/api/company/${id}/bullets`;

	describe('with authorized user', () => {
		const SqlBullet = {
			Bullet_id: 1,
			Bullet_tx: 'test',
			Company_id: 3439,
		};

		const ApiBullet = {
			bullet_id: SqlBullet.Bullet_id,
			bullet_tx: SqlBullet.Bullet_tx,
		};

		beforeEach(() => {
			CompanyProfileMocked.findByUuid.mockResolvedValue({
				addresses: [],
				bullets: [SqlBullet],
				infos: [],
			});
		});

		const opts: ServerInjectOptions = {
			auth: {
				credentials: {},
				strategy: 'jwt',
			},
			method: 'GET',
			url,
		};

		it('returns status code 200', async () => {
			const { statusCode } = await server.inject(opts);
			expect(statusCode).toEqual(200);
		});

		it('calls CompanyProfile.findByUuid()', async () => {
			await server.inject(opts);
			expect(CompanyProfileMocked.findByUuid).toHaveBeenCalledWith(id);
		});

		it('returns company profile bullets', async () => {
			const { result } = await server.inject(opts);
			expect(result).toEqual([ApiBullet]);
		});

		it('removes unknown keys', async () => {
			jest.spyOn(CompanyBulletsController, 'get').mockImplementationOnce(() =>
				Promise.resolve([
					{
						...ApiBullet,
						something: 'else',
					} as any,
				])
			);
			const { result } = await server.inject(opts);
			expect(result).toEqual([ApiBullet]);
		});
	});

	describe('without authorized user', () => {
		const opts: ServerInjectOptions = {
			method: 'GET',
			url,
		};
		it('returns 401', async () => {
			const { statusCode } = await server.inject(opts);
			expect(statusCode).toEqual(401);
		});
	});
});
