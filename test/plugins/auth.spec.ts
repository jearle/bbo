import env from '../../src/env';
import { IStrategyAsync, strategy } from '../../src/plugins/auth';

describe('auth', () => {
	it('configures strategy', async () => {
		const options: IStrategyAsync = await strategy();
		expect(options).toMatchObject({
			complete: true,
			verifyOptions: {
				algorithms: ['RS256'],
				audience: env.AUTH0_AUDIENCE,
				issuer: `https://${env.AUTH0_DOMAIN}/`,
			},
		});
	});
});
