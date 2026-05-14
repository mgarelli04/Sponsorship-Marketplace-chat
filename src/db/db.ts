import { drizzle } from 'drizzle-orm/postgres-js';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import postgres from 'postgres';
import * as schema from './schema';

const globalForPostgres = globalThis as typeof globalThis & {
	sponsorHubSql?: ReturnType<typeof postgres>;
};

loadEnv({ path: path.resolve(process.cwd(), '.env.local') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
	throw new Error('Falta DATABASE_URL o SUPABASE_DATABASE_URL en el archivo .env.local.');
}

export const queryClient =
	globalForPostgres.sponsorHubSql ??
	postgres(connectionString, {
		connect_timeout: 10,
		idle_timeout: 20,
		max: 3,
		prepare: false,
	});

if (process.env.NODE_ENV !== 'production') {
	globalForPostgres.sponsorHubSql = queryClient;
}

export const db = drizzle(queryClient, { schema });

export default db;
