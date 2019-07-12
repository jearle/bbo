import { ConnectionPool, SqlError } from 'mssql';
import env from '../env';

interface ILogger {
	log: (tags: string[], data: any) => void;
}

export interface IDbs {
	rcaweb: ConnectionPool;
}

let dbs: IDbs;

const get = () => {
	return dbs;
};

const initialize = async ({ log }: ILogger) => {
	if (dbs) {
		return dbs;
	}

	const rcaweb = await new ConnectionPool({
		connectionTimeout: env.DB_RCA_WEB_CONNECTION_TIMEOUT,
		database: env.DB_RCA_WEB_DATABSE,
		password: env.DB_RCA_WEB_PASSWORD,
		pool: {
			idleTimeoutMillis: env.DB_RCA_WEB_POOL_IDLE_TIMEOUT_MS,
			max: env.DB_RCA_WEB_POOL_MAX,
			min: env.DB_RCA_WEB_POOL_MIN,
		},
		server: env.DB_RCA_WEB_SERVER,
		user: env.DB_RCA_WEB_USER,
	} as any).connect();

	rcaweb.on('error', (err: SqlError) => {
		log(['error'], `${err.name} [${err.code}]: ${err.message}`);
	});

	dbs = {
		rcaweb,
	};

	return dbs;
};

export default {
	get,
	initialize,
};
