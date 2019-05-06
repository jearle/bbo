// import Amplify, { Auth, CognitoUser } from 'aws-amplify';
import { Request, Server, ServerRoute } from 'hapi';
import * as Jwt from 'hapi-auth-jwt2';
import * as jwksRsa from 'jwks-rsa';

// (global as any).fetch = require('node-fetch');
// (global as any).navigator = () => null;

const config = {
	Auth: {
		region: 'us-east-2',
		userPoolId: 'us-east-2_NhAst9nuH',
		userPoolWebClientId: '522qkiff5qfif8trs44638f8ln',
	},
};

const issuer: string = `https://cognito-idp.${
	config.Auth.region
}.amazonaws.com/${config.Auth.userPoolId}`;
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
		audience: config.Auth.userPoolWebClientId,
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
