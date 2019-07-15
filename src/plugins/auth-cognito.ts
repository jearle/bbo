import { Request, Server } from '@hapi/hapi';
import { hapiJwt2KeyAsync } from 'jwks-rsa';
import env from '../env';

const issuer: string = `https://cognito-idp.${
	env.COGNITO_REGION
}.amazonaws.com/${env.COGNITO_USER_POOL_ID}`;
const jwksUrl: string = `${issuer}/.well-known/jwks.json`;

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
	validate: (decoded: any, request: Request) => Promise<IValidateAsync>;
	verifyOptions: {
		issuer: string;
		audience: string;
		algorithms: string[];
	};
}

const auth = (server: Server) => {
	server.auth.strategy('jwt', 'jwt', {
		complete: true,
		key: hapiJwt2KeyAsync({
			cache: true,
			jwksRequestsPerMinute: 5,
			jwksUri: jwksUrl,
			rateLimit: true,
		} as IJwt2KeyAsync),
		validate,
		verifyOptions: {
			algorithms: ['RS256'],
			issuer,
		},
	});
	server.auth.default('jwt');
};

const validate = async (decoded: any): Promise<IValidateAsync> => {
	if (decoded) {
		return { isValid: true };
	}
	return { isValid: false };
};

export { auth, validate, IStrategyAsync };
