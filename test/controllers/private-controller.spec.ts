import * as Hapi from 'hapi';
import { init } from '../../src/server';

describe('server', () => {
	let server: Hapi.Server;

	beforeAll(async () => {
		server = await init();
	});

	afterAll(() => {
		server.stop();
	});

	describe('Private get()', () => {
		it('Attempts to access restricted content (with an INVALID Token)', async () => {
			const result = await server.inject({
				headers: { authorization: 'Bearer NOT_THE_JWT' },
				url: '/private',
			});
			expect(result.statusCode).toEqual(401);
		});
	});
});
