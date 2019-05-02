import * as Hapi from 'hapi';
import * as jwksRsa from 'jwks-rsa';
import env from '../env';

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

const auth = (server: Hapi.Server) => {
	server.auth.strategy('jwt', 'jwt', {
		complete: true,
		key: jwksRsa.hapiJwt2KeyAsync({
			cache: true,
			jwksRequestsPerMinute: 5,
			jwksUri: `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`,
			rateLimit: true,
		} as IJwt2KeyAsync),
		validate,
		verifyOptions: {
			algorithms: ['RS256'],
			audience: env.AUTH0_AUDIENCE,
			issuer: `https://${env.AUTH0_DOMAIN}/`,
		},
	});
	server.auth.default('jwt');
};

const validate = async (
	decoded: any,
	request: Hapi.Request
): Promise<IValidateAsync> => {
	if (decoded) {
		return { isValid: true };
	}
	return { isValid: false };
};

export { auth, validate, IStrategyAsync };
