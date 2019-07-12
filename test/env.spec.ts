describe('env', () => {
	beforeEach(() => {
		jest.resetModules();
		process.env.DB_RCA_WEB_CONNECTION_TIMEOUT = '1';
		process.env.DB_RCA_WEB_POOL_IDLE_TIMEOUT_MS = '1';
		process.env.DB_RCA_WEB_POOL_MAX = '1';
		process.env.DB_RCA_WEB_POOL_MIN = '1';
	});

	const getEnv = () => {
		return jest.requireActual('../src/env').default;
	};

	it('includes expected keys', async () => {
		const env = getEnv();
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

	it('parses integer keys', async () => {
		const env = getEnv();
		const keys = [
			'DB_RCA_WEB_CONNECTION_TIMEOUT',
			'DB_RCA_WEB_POOL_IDLE_TIMEOUT_MS',
			'DB_RCA_WEB_POOL_MAX',
			'DB_RCA_WEB_POOL_MIN',
		];
		keys.forEach(k => expect(typeof (env as any)[k]).toEqual('number'));
	});

	it('returns null when integer key not present', async () => {
		delete process.env.DB_RCA_WEB_POOL_MIN;
		const env = getEnv();
		expect(env.DB_RCA_WEB_POOL_MIN).toBeNull();
	});
});
