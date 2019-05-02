import * as Hapi from 'hapi';
import { init } from '../../src/server';

describe('server', () => {
	let server: Hapi.Server;

	beforeAll(async () => {
		server = await init(false);
	});

	afterAll(() => {
		server.stop();
	});

	describe('get()', () => {
		it('returns hello', async () => {
			const result = await server.inject({
				url: '/hello',
			});
			expect(result.payload).toEqual('hello');
		});
	});
});
