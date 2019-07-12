import * as Sql from 'mssql';
import dbs from '../../src/dbs';
import env from '../../src/env';

describe('dbs', () => {
	describe('initialize()', () => {
		let instance: any;
		let rcaweb: any;
		let connectionPoolSpy = jest.fn();
		let connect = jest.fn();
		const logger = { log: jest.fn() };

		beforeAll(async () => {
			rcaweb = {
				on: jest.fn(),
			};
			connectionPoolSpy = jest
				.spyOn(Sql as any, 'ConnectionPool')
				.mockImplementation(() => {
					connect = jest.fn().mockResolvedValue(rcaweb);
					return {
						connect,
					};
				});

			env.DB_RCA_WEB_CONNECTION_TIMEOUT = 0;
			env.DB_RCA_WEB_DATABSE = 'DB_RCA_WEB_DATABSE';
			env.DB_RCA_WEB_PASSWORD = 'DB_RCA_WEB_PASSWORD';
			env.DB_RCA_WEB_POOL_IDLE_TIMEOUT_MS = 0;
			env.DB_RCA_WEB_POOL_MAX = 2;
			env.DB_RCA_WEB_POOL_MIN = 1;
			env.DB_RCA_WEB_SERVER = 'DB_RCA_WEB_SERVER';
			env.DB_RCA_WEB_USER = 'DB_RCA_WEB_USER';

			instance = await dbs.initialize(logger);
		});

		it('sets up rcaweb connection', () => {
			expect(connectionPoolSpy).toHaveBeenCalledWith({
				connectionTimeout: env.DB_RCA_WEB_CONNECTION_TIMEOUT,
				database: env.DB_RCA_WEB_DATABSE,
				password: env.DB_RCA_WEB_PASSWORD,
				pool: {
					idleTimeoutMillis: env.DB_RCA_WEB_POOL_IDLE_TIMEOUT_MS,
					max: env.DB_RCA_WEB_POOL_MAX,
					min: env.DB_RCA_WEB_POOL_MIN,
				},
				server: env.DB_RCA_WEB_SERVER,
				user: env.DB_RCA_WEB_USER,
			});
		});

		it('returns cached instance if already called', async () => {
			const instance2 = await dbs.initialize(logger);
			expect(instance).toEqual(instance2);
		});

		it('subscribes to errors', () => {
			expect(rcaweb.on).toHaveBeenCalled();
			expect(rcaweb.on.mock.calls[0][0]).toEqual('error');
		});

		it('logs errors', () => {
			expect(rcaweb.on).toHaveBeenCalled();
			const errHandler = rcaweb.on.mock.calls[0][1];
			errHandler({
				code: 'code',
				message: 'message',
				name: 'name',
			});
			expect(logger.log).toHaveBeenCalledWith(
				['error'],
				`name [code]: message`
			);
		});

		describe('get()', () => {
			it('returns instance after initialized', () => {
				const instance2 = dbs.get();
				expect(instance2).toEqual({
					rcaweb,
				});
			});
		});
	});
});
