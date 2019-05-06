import env from '../src/env';

describe('env', () => {
	it('includes expected keys', async () => {
		const keys = [
			'API_PORT',
			'API_HOST',
			'COGNITO_CLIENT_ID',
			'COGNITO_REGION',
			'COGNITO_USER_POOL_ID',
		];
		Object.keys(env).forEach(k => expect(keys).toContain(k));
	});
});
