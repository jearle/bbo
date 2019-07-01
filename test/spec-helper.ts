import { IDbs } from '../src/dbs';

const setupMssqlDbMock = () => {
	const request = jest.fn();
	const input = jest.fn();
	const execute = jest.fn();
	const query = jest.fn();
	const connect = jest.fn();
	const close = jest.fn();
	const transaction = jest.fn();
	const connection = {
		close,
		connect,
		connected: true,
		connecting: false,
		execute,
		input,
		query,
		request,
		transaction,
	};
	request.mockReturnValue(connection);
	input.mockReturnValue(connection);
	execute.mockReturnValue(connection);
	query.mockReturnValue(connection);
	connect.mockReturnValue(connection);
	close.mockReturnValue(connection);
	transaction.mockReturnValue(connection);
	return connection as any;
};

const setupMockDbs = (): IDbs => {
	return {
		rcaweb: setupMssqlDbMock(),
	};
};

export { setupMockDbs };
