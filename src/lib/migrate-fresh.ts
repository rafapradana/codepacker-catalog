import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

async function getAllTables(db: any): Promise<string[]> {
  const result = await db.execute(sql`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  
  return result.map((row: any) => row.tablename);
}

async function migrateFresh() {
  console.log('🔄 Starting fresh migration...');
  
  const client = postgres(connectionString!, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    // Get all existing tables dynamically
    console.log('🔍 Getting all existing tables...');
    const tableNames = await getAllTables(db);
    
    if (tableNames.length > 0) {
      console.log(`📋 Found ${tableNames.length} tables: ${tableNames.join(', ')}`);
      
      // Drop all tables with CASCADE to handle foreign key constraints
    console.log('🗑️  Dropping all existing tables...');
    for (const tableName of tableNames) {
      try {
        await db.execute(sql.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`));
        console.log(`   ✓ Dropped table: ${tableName}`);
      } catch (error) {
        console.log(`   ⚠️  Could not drop table ${tableName}: ${error}`);
      }
    }
    
    // Also drop drizzle migration tracking tables to force fresh migration
    console.log('🗑️  Dropping migration tracking tables...');
    try {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "drizzle"."__drizzle_migrations" CASCADE;`));
      await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`));
      console.log('   ✓ Dropped migration tracking');
    } catch (error) {
      console.log(`   ⚠️  Could not drop migration tracking: ${error}`);
    }
    } else {
      console.log('📋 No existing tables found');
      
      // Still drop drizzle migration tracking to force fresh migration
      console.log('🗑️  Dropping migration tracking tables...');
      try {
        await db.execute(sql.raw(`DROP TABLE IF EXISTS "drizzle"."__drizzle_migrations" CASCADE;`));
        await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`));
        console.log('   ✓ Dropped migration tracking');
      } catch (error) {
        console.log(`   ⚠️  Could not drop migration tracking: ${error}`);
      }
    }

    // Run migrations
    console.log('📦 Running migrations...');
    const migrationResult = await migrate(db, { migrationsFolder: './drizzle' });
    console.log('📦 Migration result:', migrationResult);
    
    // Check if tables were created
    console.log('🔍 Verifying tables after migration...');
    const tablesAfter = await getAllTables(db);
    console.log(`📋 Tables after migration: ${tablesAfter.length} found`);
    if (tablesAfter.length > 0) {
      tablesAfter.forEach(name => console.log(`   - ${name}`));
    }
    
    console.log('✅ Fresh migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the migration
migrateFresh().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});