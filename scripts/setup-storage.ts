#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Storage buckets configuration based on schema analysis
const STORAGE_BUCKETS = [
  {
    name: 'profile-photos',
    description: 'Student profile photos',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
  },
  {
    name: 'skill-icons',
    description: 'Icons for skills',
    public: true,
    allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg'],
    fileSizeLimit: 1 * 1024 * 1024, // 1MB
  },
  {
    name: 'techstack-icons',
    description: 'Icons for tech stacks',
    public: true,
    allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg'],
    fileSizeLimit: 1 * 1024 * 1024, // 1MB
  },
  {
    name: 'project-thumbnails',
    description: 'Project thumbnail images',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  },
  {
    name: 'project-media',
    description: 'Project media files (images, videos)',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
  },
  {
    name: 'blog-thumbnails',
    description: 'Blog thumbnail images',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  },
  {
    name: 'blog-media',
    description: 'Blog media files (images, videos, documents)',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf'],
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
  }
];

async function createStorageBucket(bucket: typeof STORAGE_BUCKETS[0]) {
  console.log(`📦 Creating bucket: ${bucket.name}`);
  
  const { data, error } = await supabase.storage.createBucket(bucket.name, {
    public: bucket.public,
    allowedMimeTypes: bucket.allowedMimeTypes,
    fileSizeLimit: bucket.fileSizeLimit
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log(`✅ Bucket ${bucket.name} already exists`);
      return true;
    } else {
      console.error(`❌ Error creating bucket ${bucket.name}:`, error.message);
      return false;
    }
  }

  console.log(`✅ Successfully created bucket: ${bucket.name}`);
  return true;
}

async function createStoragePolicy(bucketName: string, policyName: string, policyType: string, condition: string) {
  console.log(`🔐 Creating policy: ${policyName} for bucket: ${bucketName}`);
  
  const sql = `
    CREATE POLICY "${policyName}" ON storage.objects
    FOR ${policyType} ${condition};
  `;
  
  const { data, error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
      console.log(`✅ Policy ${policyName} already exists`);
      return true;
    } else {
      console.error(`❌ Error creating policy ${policyName}:`, error.message);
      return false;
    }
  }

  console.log(`✅ Successfully created policy: ${policyName}`);
  return true;
}

async function setupStoragePolicies() {
  console.log('\n🔐 Setting up storage policies...');
  console.log('⚠️  Note: Automatic policy creation is not supported by Supabase client.');
  console.log('📝 Please run the SQL file manually to create storage policies:');
  console.log('   1. Open your Supabase SQL Editor');
  console.log('   2. Copy and paste the content from: scripts/setup-storage-policies.sql');
  console.log('   3. Execute the SQL commands');
  console.log('');
  console.log('💡 Alternatively, you can create policies via Supabase Dashboard:');
  console.log('   Authentication > Policies > Create Policy');
}

async function main() {
  console.log('🚀 Starting Supabase Storage setup...\n');

  try {
    // Test connection
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('❌ Failed to connect to Supabase:', error.message);
      process.exit(1);
    }

    console.log('✅ Connected to Supabase successfully\n');

    // Create storage buckets
    console.log('📦 Creating storage buckets...');
    let successCount = 0;
    
    for (const bucket of STORAGE_BUCKETS) {
      const success = await createStorageBucket(bucket);
      if (success) successCount++;
    }

    console.log(`\n✅ Successfully processed ${successCount}/${STORAGE_BUCKETS.length} buckets`);

    // Setup storage policies
    await setupStoragePolicies();

    console.log('\n🎉 Storage setup completed successfully!');
    console.log('\n📋 Created buckets:');
    STORAGE_BUCKETS.forEach(bucket => {
      console.log(`  • ${bucket.name} - ${bucket.description}`);
    });

    console.log('\n🔗 Storage URLs will be in format:');
    console.log(`  ${supabaseUrl}/storage/v1/object/public/{bucket-name}/{file-path}`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { STORAGE_BUCKETS, createStorageBucket, setupStoragePolicies };