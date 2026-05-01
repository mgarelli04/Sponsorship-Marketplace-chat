import { drizzle } from 'drizzle-orm/postgres-js';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import postgres from 'postgres';
import * as schema from './schema';

loadEnv({ path: path.resolve(process.cwd(), '.env.local') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
	throw new Error('Falta DATABASE_URL o SUPABASE_DATABASE_URL en el archivo .env.local.');
}

const queryClient = postgres(connectionString, { prepare: false });

export const db = drizzle(queryClient, { schema });

export default db;
