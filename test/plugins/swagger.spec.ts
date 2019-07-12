import Swagger from '../../src/plugins/swagger';
import { init } from '../../src/server';
const HapiSwagger = require('hapi-swagger');

jest.mock('./../../package', () => ({
	version: 200,
}));

jest.mock('./../../src/dbs');

describe('plugins/swagger', () => {
	it('sets title', () => {
		expect(Swagger.options.info.title).toEqual('RCA API Documentation');
	});

	it('sets version from package.json', () => {
		expect(Swagger.options.info.version).toEqual(200);
	});

	it('sets plugin to hapi-swagger', () => {
		expect(Swagger.plugin).toEqual(HapiSwagger);
	});

	it('adds documentation route (swagger)', async () => {
		const server = await init();
		const response = await server.inject({
			method: 'GET',
			url: '/documentation',
		});

		expect(response.statusCode).toEqual(200);
		server.stop();
	});
});
