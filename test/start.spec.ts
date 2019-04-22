import { init } from '../src/server';

jest.mock('../src/server');

describe('start', () => {
	it('calls init', async () => {
		expect(init).not.toHaveBeenCalled();
		jest.requireActual('./../src/start');
		expect(init).toHaveBeenCalled();
	});
});
