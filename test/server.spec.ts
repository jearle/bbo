import * as Hapi from 'hapi';
import { mocked } from 'ts-jest/utils';
import env from '../src/env';
import routes from '../src/routes';
import { init } from '../src/server';

jest.mock('hapi');

const HapiMocked = mocked(Hapi, true);

describe('server', () => {
	let start = jest.fn();
	let route = jest.fn();
	const info = {
		uri: 'api.rcanalytics.com',
	};
	beforeEach(() => {
		global.console.log = jest.fn();
		start = jest.fn();
		route = jest.fn();
		HapiMocked.Server.mockImplementationOnce(options => {
			const server = new Hapi.Server(options);
			return Object.assign(server, { start, route, info });
		});
	});

	describe('init()', () => {
		it('uses env variables', async () => {
			env.API_HOST = 'API_HOST';
			env.API_PORT = 'API_PORT';
			HapiMocked.Server.mockImplementationOnce(options => {
				expect(options).toMatchObject({
					host: env.API_HOST,
					port: env.API_PORT,
				});
				return new Hapi.Server(options);
			});
			await init();
		});

		it('calls server.start()', async () => {
			await init();
			expect(start).toHaveBeenCalled();
		});

		it('adds routes', async () => {
			await init();
			expect(route).toHaveBeenCalledWith(routes);
		});

		it('logs to console', async () => {
			await init();
			expect(global.console.log).toHaveBeenCalledWith(
				`Server running at: ${info.uri}`
			);
		});
	});
});
