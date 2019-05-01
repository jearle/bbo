import { Server, ServerInjectOptions } from 'hapi';
import { init } from '../../src/server';

describe('private-controller', () => {
	let server: Server;

	beforeAll(async () => {
		server = await init();
	});

	afterAll(() => {
		server.stop();
	});

	describe('with authorized user', () => {
		const opts: ServerInjectOptions = {
			headers: {
				Authorization:
					'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5EQkdSakF4TTBVMk9EQTBPRFEyTjBRMk5qQkdSRU15TnpkQlFUSTFSRFkxUWtFNFJrWXlNdyJ9.eyJpc3MiOiJodHRwczovL2NkLXByb2R1Y3QtYXBpLmF1dGgwLmNvbS8iLCJzdWIiOiJJN0VEcHU4QVJoNk40aGZiVWw4ckNXN010dUFYR1lSZkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9jZC1wcm9kdWN0LWFwaSIsImlhdCI6MTU1NjY0OTY1NywiZXhwIjoxNTU2NzM2MDU3LCJhenAiOiJJN0VEcHU4QVJoNk40aGZiVWw4ckNXN010dUFYR1lSZiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.lnS-RLVVKbxkvfmgWLh3eCaB-fmWUoOzPMHFNQSvKGOseJcIPBAIlpCfWlO-5T0w1kL8SL74N-84RLZVLAwSoHiRgcBqWYplo4wjsFKYu673GA27HKLsbLEaIrREUP4hbt1Fqt1g49InbWZEp9e9HXfL8vnIlXPXESPawvoD40HuaenrXbw55yUsqtxboVrEiPdOxp1ytiNKkIRCvE2PEkMt3wf0jiONl6XtBzHv9J0w9-K9O1JuCOdXrgA5TZ68FLZYbyfYsy5V00gHavaw4Vx8yxyGR-cb-i4jNCZtB8-zBcysh-uMlHhc4KiARqyD9UlFHz2h0TlmkBSHDTBOTg',
			},
			url: '/private',
		};
		it('returns hello message', async () => {
			const result = await server.inject(opts);
			expect(result.payload).toEqual('Hello from a private endpoint!');
		});
	});

	describe('without authorized user', () => {
		const opts: ServerInjectOptions = {
			headers: { Authorization: 'Bearer notjwt' },
			url: '/private',
		};
		it('returns 401', async () => {
			const result = await server.inject(opts);
			expect(result.statusCode).toEqual(401);
		});
	});
});
