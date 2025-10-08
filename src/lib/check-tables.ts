import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

async function checkTables() {
  console.log('🔍 Checking database tables...');
  
  const client = postgres(connectionString!, { max: 1 });
  const db = drizzle(client);

  try {
    const result = await db.execute(sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    const tableNames = result.map((row: any) => row.tablename);
    
    if (tableNames.length > 0) {
      console.log(`📋 Found ${tableNames.length} tables:`);
      tableNames.forEach(name => console.log(`   - ${name}`));
    } else {
      console.log('❌ No tables found in database!');
    }

  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    await client.end();
  }
}

checkTables();