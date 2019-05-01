import { Request, ResponseToolkit } from 'hapi';

class PrivateController {
	public static get(request: Request, h: ResponseToolkit) {
		return {
			message: 'Hello from a private endpoint!',
		};
	}
}

export default PrivateController;
