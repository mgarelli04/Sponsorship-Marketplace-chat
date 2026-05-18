import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { defineConfig } from 'drizzle-kit';

loadEnv({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
