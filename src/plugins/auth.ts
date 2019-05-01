/* tslint:disable:object-literal-sort-keys */
import * as Hapi from 'hapi';
import * as Jwt from 'hapi-auth-jwt2';
import * as jwksRsa from 'jwks-rsa';
import env from '../env';

// IValidate interface
interface IValidateAsync {
	isValid: boolean;
	credentials?: {};
}

interface IJwt2KeyAsync {
	cache: boolean;
	rateLimit: boolean;
	jwksRequestsPerMinute: number;
	jwksUri: string;
}

interface IStrategyAsync {
	complete: boolean;
	key: (name: string, scheme: string, options?: any) => void;
	validate: (decoded: any, request: Hapi.Request) => Promise<IValidateAsync>;
	verifyOptions: {
		issuer: string;
		audience: string;
		algorithms: string[];
	};
}

const auth = async (server: Hapi.Server): Promise<void> => {
	try {
		if ('auth' in server) {
			await server.auth.strategy('jwt', 'jwt', await strategy());
			await server.auth.default('jwt');
		}
	} catch (error) {
		server.log(['error'], error);
	}
};

// Hapi, JWT, Auth0 strategy setup
const strategy = async (): Promise<IStrategyAsync> => {
	try {
		return await {
			complete: true,
			key: jwksRsa.hapiJwt2KeyAsync({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`,
			} as IJwt2KeyAsync),
			validate,
			verifyOptions: {
				algorithms: ['RS256'],
				audience: env.AUTH0_AUDIENCE,
				issuer: `https://${env.AUTH0_DOMAIN}/`,
			},
		};
	} catch (error) {
		// @todo, error handling...
		console.error(error);
	}
};

// validate function
const validate = async (
	decoded: any,
	request: Hapi.Request
): Promise<IValidateAsync> => {
	try {
		if (decoded && decoded.sub) {
			return decoded.scope
				? {
						isValid: true,
						credentials: {
							scope: decoded.scope.split(' '),
						},
				  }
				: { isValid: true };
		}
		return { isValid: false };
	} catch (error) {
		request.server.log(['error'], error);
	}
};

export { Jwt, strategy, auth, IStrategyAsync };
