import env from '../src/env';

describe('env', () => {
	it('includes expected keys', async () => {
		const keys = [
			'API_HOST',
			'API_PORT',
			'COGNITO_CLIENT_ID',
			'COGNITO_REGION',
			'COGNITO_USER_POOL_ID',
			'DB_RCA_WEB_CONNECTION_TIMEOUT',
			'DB_RCA_WEB_DATABSE',
			'DB_RCA_WEB_PASSWORD',
			'DB_RCA_WEB_POOL_IDLE_TIMEOUT_MS',
			'DB_RCA_WEB_POOL_MAX',
			'DB_RCA_WEB_POOL_MIN',
			'DB_RCA_WEB_PORT',
			'DB_RCA_WEB_SERVER',
			'DB_RCA_WEB_USER',
		];
		Object.keys(env).forEach(k => expect(keys).toContain(k));
	});
});
