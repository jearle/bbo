import { IStrategyAsync, strategy } from '../src/auth';
import env from '../src/env';

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
