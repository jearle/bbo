import { Server, ServerInjectOptions } from 'hapi';
import { init } from '../../src/server';

describe('private-controller', () => {
	let server: Server;

	beforeAll(async () => {
		server = await init(false);
	});

	afterAll(() => {
		server.stop();
	});

	describe('with authorized user', () => {
		const opts: ServerInjectOptions = {
			auth: {
				credentials: {},
				strategy: 'jwt',
			},
			url: '/private',
		};
		it('returns hello message', async () => {
			const { result } = await server.inject(opts);
			expect(result).toEqual({ message: 'Hello from a private endpoint!' });
		});
	});

	describe('without authorized user', () => {
		const opts: ServerInjectOptions = {
			url: '/private',
		};
		it('returns 401', async () => {
			const result = await server.inject(opts);
			expect(result.statusCode).toEqual(401);
		});
	});
});
