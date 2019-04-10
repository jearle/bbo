import env from '../src/env';

describe('env', () => {
	it('includes expected keys', async () => {
		const keys = ['API_PORT', 'API_HOST'];
		Object.keys(env).forEach(k => expect(keys).toContain(k));
	});
});
