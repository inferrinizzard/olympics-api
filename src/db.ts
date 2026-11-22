import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

dotenv.config();

const env = process.env;
const isProduction = env.NODE_ENV === 'production';

// const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`;
const connectionString = `postgresql://olympics_user:VWQuVCxDeDAqIsskRN7GTA@free-tier4.aws-us-west-2.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dolympics-api-3700`;

export const pgp = pgPromise({ capSQL: true });
export const db = pgp({
	connectionString: isProduction ? env.DATABASE_URL : connectionString,
	ssl: isProduction ? { rejectUnauthorized: false } : false,
});
