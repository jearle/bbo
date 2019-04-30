/* tslint:disable:object-literal-sort-keys */
import * as Hapi from 'hapi';
import * as Jwt from 'hapi-auth-jwt2';
import * as jwksRsa from 'jwks-rsa';
import env from './env';

// IValidate interface
interface IValidate {
	isValid: boolean;
	credentials?: {};
}

// setup Auth0 options
const strategy = () => ({
	complete: true,
	key: jwksRsa.hapiJwt2KeyAsync({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`,
	}),
	validate,
	verifyOptions: {
		algorithms: ['RS256'],
		audience: env.AUTH0_AUDIENCE,
		issuer: `https://${env.AUTH0_DOMAIN}/`,
	},
});

// validate function
const validate = async (
	decoded: any,
	request: Hapi.Request
): Promise<IValidate> => {
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
};

export { Jwt, strategy, validate };
