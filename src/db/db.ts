import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('Falta DATABASE_URL en el archivo .env.');
}

const queryClient = postgres(connectionString, { prepare: false });

export const db = drizzle(queryClient, { schema });

export default db;
