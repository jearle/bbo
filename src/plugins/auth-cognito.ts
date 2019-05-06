import { Request, Server, ServerRoute } from 'hapi';
import * as Jwt from 'hapi-auth-jwt2';
import * as jwksRsa from 'jwks-rsa';
import env from '../env';

const issuer: string = `https://cognito-idp.${
	env.COGNITO_REGION
}.amazonaws.com/${env.COGNITO_USER_POOL_ID}`;
const jwksUrl: string = `${issuer}/.well-known/jwks.json`;

const strategy = () => ({
	complete: true,
	key: jwksRsa.hapiJwt2KeyAsync({
		cache: true,
		jwksRequestsPerMinute: 5,
		jwksUri: jwksUrl,
		rateLimit: true,
	}),
	validate,
	verifyOptions: {
		algorithms: ['RS256'],
		audience: env.COGNITO_CLIENT_ID,
		issuer,
	},
});

const validate = async (decoded: any, request: Request): Promise<any> => {
	if (decoded && decoded.sub) {
		return decoded.scope
			? {
					credentials: {
						scope: decoded.scope.split(' '),
					},
					isValid: true,
			  }
			: { isValid: true };
	}
	return { isValid: false };
};

const auth = async (server: Server): Promise<void> => {
	try {
		if ('auth' in server) {
			await server.auth.strategy('jwt', 'jwt', await strategy());
			await server.auth.default('jwt');
		}
	} catch (error) {
		server.log(['error'], error);
	}
};

export { Jwt, auth, strategy };
