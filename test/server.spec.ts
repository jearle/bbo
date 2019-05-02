import * as Hapi from 'hapi';
import * as Jwt from 'hapi-auth-jwt2';
import * as Inert from 'inert';
import { mocked } from 'ts-jest/utils';
import * as Vision from 'vision';
import env from '../src/env';
import Swagger from '../src/plugins/swagger';
import routes from '../src/routes';
import { init } from '../src/server';

jest.mock('hapi');

const HapiMocked = mocked(Hapi, true);

describe('server', () => {
	let start = jest.fn();
	let route = jest.fn();
	let register = jest.fn();
	let auth = {
		default: jest.fn(),
		strategy: jest.fn(),
	};
	const info = {
		uri: 'api.rcanalytics.com',
	};
	beforeEach(() => {
		global.console.log = jest.fn();
		start = jest.fn();
		route = jest.fn();
		register = jest.fn();
		auth = {
			default: jest.fn(),
			strategy: jest.fn(),
		};

		HapiMocked.Server.mockImplementationOnce(options => {
			const server = new Hapi.Server(options);
			return Object.assign(server, { start, route, info, register, auth });
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

		it('registers Jwt', async () => {
			await init();
			const plugins = register.mock.calls[0][0];
			expect(plugins).toContain(Jwt);
		});

		it('registers Inert', async () => {
			await init();
			const plugins = register.mock.calls[0][0];
			expect(plugins).toContain(Inert);
		});

		it('registers Vision', async () => {
			await init();
			const plugins = register.mock.calls[0][0];
			expect(plugins).toContain(Vision);
		});

		it('registers Swagger', async () => {
			await init();
			const plugins = register.mock.calls[0][0];
			expect(plugins).toContain(Swagger);
		});
	});
});
