import { strategy } from '../src/auth';
import env from '../src/env';

describe('auth', () => {
	it('builds auth strategy options object', async () => {
		const options = strategy();
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
