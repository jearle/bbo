import { Server } from '@hapi/hapi';
import * as Jwt from 'hapi-auth-jwt2';
import { auth, validate } from '../../src/plugins/auth-cognito';

describe('plugins/auth', () => {
	describe('auth()', () => {
		let server: Server;

		beforeEach(() => {
			server = new Server();
			server.register([Jwt] as any);
		});

		afterEach(() => {
			server.stop();
		});

		it('should register jwt auth strategy', async () => {
			const spy = jest.spyOn(server.auth, 'strategy');
			await auth(server);
			expect(spy).toHaveBeenCalled();
			expect(spy.mock.calls[0][0]).toEqual('jwt');
		});

		it('should set default auth strategy to jwt', async () => {
			const spy = jest.spyOn(server.auth, 'default');
			await auth(server);
			expect(spy).toHaveBeenLastCalledWith('jwt');
		});
	});

	describe('validate()', () => {
		describe('with decoded', () => {
			it('it returns isValid true', async () => {
				const result = await validate('something');
				expect(result).toMatchObject({
					isValid: true,
				});
			});
		});

		describe('without decoded', () => {
			it('it returns isValid false', async () => {
				const result = await validate(null);
				expect(result).toMatchObject({
					isValid: false,
				});
			});
		});
	});
});
