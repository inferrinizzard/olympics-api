import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();

const env = process.env;
const isProduction = env.NODE_ENV === 'production';

const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`;

export const pgp = pgPromise({ capSQL: true });
export const db = pgp({
	connectionString: isProduction ? env.DATABASE_URL : connectionString,
	ssl: isProduction,
});
