import * as server from '../src/server';

describe('start', () => {
	it('initializes and starts server', async () => {
		const start = jest.fn();
		const spy = jest.spyOn(server as any, 'init').mockImplementation(() => ({
			info: {
				uri: 'uri',
			},
			start,
		}));
		await jest.requireActual('./../src/start');
		expect(spy).toHaveBeenCalled();
		expect(start).toHaveBeenCalled();
	});
});
