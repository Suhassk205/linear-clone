import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// For query purposes with connection pooling
const queryClient = postgres(process.env.DATABASE_URL, {
  max: 20, // Maximum number of connections in the pool
  idle_timeout: 30, // Close idle connections after 30 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

export const db = drizzle(queryClient, { schema });

// For migrations
export const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

// Export schema for convenience
export { schema };
