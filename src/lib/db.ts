import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import * as schema from './schema';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Create the connection
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export the client for direct queries if needed
export { client };