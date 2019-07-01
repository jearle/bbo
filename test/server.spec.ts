import * as Hapi from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as Jwt from 'hapi-auth-jwt2';
import { mocked } from 'ts-jest/utils';
import dbs from '../src/dbs';
import env from '../src/env';
import Swagger from '../src/plugins/swagger';
import routes from '../src/routes';
import { init } from '../src/server';

jest.mock('@hapi/hapi');

const HapiMocked = mocked(Hapi, true);
const dbsMocked = mocked(dbs, true);

jest.mock('./../src/dbs');

describe('server', () => {
	let initialize = jest.fn();
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
		initialize = jest.fn();
		route = jest.fn();
		register = jest.fn();
		auth = {
			default: jest.fn(),
			strategy: jest.fn(),
		};

		HapiMocked.Server.mockImplementationOnce(options => {
			const server = new Hapi.Server(options);
			return Object.assign(server, {
				app: {},
				auth,
				info,
				initialize,
				register,
				route,
			});
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

		it('calls server.initialize()', async () => {
			await init();
			expect(initialize).toHaveBeenCalled();
		});

		it('adds routes', async () => {
			await init();
			expect(route).toHaveBeenCalledWith(routes);
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

		it('initializes databses', async () => {
			await init();
			expect(dbsMocked.initialize).toHaveBeenCalled();
			expect(dbsMocked.initialize.mock.calls[0][0]).toBeInstanceOf(Hapi.Server);
		});
	});
});
