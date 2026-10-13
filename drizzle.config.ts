import { defineConfig } from 'drizzle-kit';
import { env } from "./src/data/env.ts"

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE,
  },
});