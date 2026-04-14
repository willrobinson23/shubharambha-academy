/**
 * SUPABASE DATA + STORAGE MIGRATION SCRIPT
 * Migrates all data and storage files from old project to new project.
 * 
 * Usage: node migrate-data.mjs
 */

import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURATION - OLD PROJECT
// ============================================
const OLD_URL = 'https://kjaomfckfzbpxmwkcggw.supabase.co';
const OLD_SERVICE_ROLE = 'PASTE_YOUR_OLD_SERVICE_ROLE_KEY_HERE'; // Get from old project: Settings > API > service_role
const OLD_PROJECT_ID = 'kjaomfckfzbpxmwkcggw';

// ============================================
// CONFIGURATION - NEW PROJECT
// ============================================
const NEW_URL = 'https://npwsyxghghyywwgnytmx.supabase.co';
const NEW_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wd3N5eGdoZ2h5eXd3Z255dG14Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExNzM5NywiZXhwIjoyMDkxNjkzMzk3fQ.sc0pCo1lGjKe9-OgoFb5gptLBdmwN884TgJsmyyEGGA';
const NEW_PROJECT_ID = 'npwsyxghghyywwgnytmx';

// Create clients with service_role to bypass RLS
const oldSupabase = createClient(OLD_URL, OLD_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const newSupabase = createClient(NEW_URL, NEW_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ============================================
// TABLES TO MIGRATE (order matters for dependencies)
// ============================================
const TABLES = [
  'site_stats',
  'events',
  'admissions',
  'contact_messages',
  'testimonials',
  'gallery_images',
  'team_members',
  'achievers',
  'news',
  'support_staff',
  // user_roles is skipped - you already created the admin user manually
];

// Storage buckets to migrate
const BUCKETS = ['events', 'gallery'];

// ============================================
// HELPER: Replace old storage URLs with new ones
// ============================================
function replaceStorageUrl(value) {
  if (typeof value !== 'string') return value;
  return value.replace(
    new RegExp(OLD_PROJECT_ID, 'g'),
    NEW_PROJECT_ID
  );
}

// ============================================
// MIGRATE TABLE DATA
// ============================================
async function migrateTable(tableName) {
  console.log(`\n📋 Migrating table: ${tableName}...`);

  // Read all rows from old project
  const { data: rows, error: readErr } = await oldSupabase
    .from(tableName)
    .select('*');

  if (readErr) {
    console.error(`  ❌ Failed to read ${tableName}:`, readErr.message);
    return 0;
  }

  if (!rows || rows.length === 0) {
    console.log(`  ⏭️  No data in ${tableName}, skipping.`);
    return 0;
  }

  console.log(`  📦 Found ${rows.length} rows.`);

  // Replace old storage URLs with new ones in image_url fields
  const updatedRows = rows.map(row => {
    const newRow = { ...row };
    if (newRow.image_url) {
      newRow.image_url = replaceStorageUrl(newRow.image_url);
    }
    return newRow;
  });

  // Insert into new project (in batches of 50 to avoid payload limits)
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < updatedRows.length; i += batchSize) {
    const batch = updatedRows.slice(i, i + batchSize);
    const { error: writeErr } = await newSupabase
      .from(tableName)
      .upsert(batch, { onConflict: 'id' });

    if (writeErr) {
      console.error(`  ❌ Failed to insert batch into ${tableName}:`, writeErr.message);
    } else {
      inserted += batch.length;
    }
  }

  console.log(`  ✅ Inserted ${inserted}/${rows.length} rows.`);
  return inserted;
}

// ============================================
// MIGRATE STORAGE BUCKET
// ============================================
async function migrateBucket(bucketName) {
  console.log(`\n🗂️  Migrating storage bucket: ${bucketName}...`);

  // List all files in the old bucket
  const { data: files, error: listErr } = await oldSupabase
    .storage
    .from(bucketName)
    .list('', { limit: 1000 });

  if (listErr) {
    console.error(`  ❌ Failed to list files in ${bucketName}:`, listErr.message);
    return 0;
  }

  if (!files || files.length === 0) {
    console.log(`  ⏭️  No files in ${bucketName}, skipping.`);
    return 0;
  }

  // Filter out folders (they have null metadata)
  const actualFiles = files.filter(f => f.id);
  console.log(`  📦 Found ${actualFiles.length} files.`);

  let migrated = 0;

  for (const file of actualFiles) {
    const filePath = file.name;
    try {
      // Download from old
      const { data: fileData, error: dlErr } = await oldSupabase
        .storage
        .from(bucketName)
        .download(filePath);

      if (dlErr) {
        console.error(`  ❌ Failed to download ${filePath}:`, dlErr.message);
        continue;
      }

      // Upload to new
      const { error: upErr } = await newSupabase
        .storage
        .from(bucketName)
        .upload(filePath, fileData, {
          contentType: file.metadata?.mimetype || 'application/octet-stream',
          upsert: true,
        });

      if (upErr) {
        console.error(`  ❌ Failed to upload ${filePath}:`, upErr.message);
        continue;
      }

      migrated++;
      console.log(`  ✅ ${filePath} (${migrated}/${actualFiles.length})`);
    } catch (err) {
      console.error(`  ❌ Error migrating ${filePath}:`, err.message);
    }
  }

  // Also check for nested folders (some files may be in subdirectories)
  const folders = files.filter(f => !f.id && f.name);
  for (const folder of folders) {
    const { data: subFiles } = await oldSupabase
      .storage
      .from(bucketName)
      .list(folder.name, { limit: 1000 });

    if (subFiles) {
      const subActualFiles = subFiles.filter(f => f.id);
      for (const subFile of subActualFiles) {
        const subPath = `${folder.name}/${subFile.name}`;
        try {
          const { data: fileData, error: dlErr } = await oldSupabase
            .storage
            .from(bucketName)
            .download(subPath);

          if (dlErr) continue;

          const { error: upErr } = await newSupabase
            .storage
            .from(bucketName)
            .upload(subPath, fileData, {
              contentType: subFile.metadata?.mimetype || 'application/octet-stream',
              upsert: true,
            });

          if (!upErr) {
            migrated++;
            console.log(`  ✅ ${subPath} (${migrated})`);
          }
        } catch (err) {
          console.error(`  ❌ Error migrating ${subPath}:`, err.message);
        }
      }
    }
  }

  console.log(`  ✅ Migrated ${migrated} files from ${bucketName}.`);
  return migrated;
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('🚀 Starting Supabase migration...');
  console.log(`   Old: ${OLD_URL}`);
  console.log(`   New: ${NEW_URL}`);

  if (OLD_SERVICE_ROLE === 'PASTE_YOUR_OLD_SERVICE_ROLE_KEY_HERE') {
    console.error('\n❌ ERROR: You need to paste your OLD project\'s service_role key!');
    console.error('   Go to old Supabase project → Settings → API → service_role key');
    console.error('   Then paste it in migrate-data.mjs on line 17');
    process.exit(1);
  }

  // --- Step 1: Migrate storage files FIRST ---
  console.log('\n' + '='.repeat(50));
  console.log('STEP 1: MIGRATING STORAGE FILES');
  console.log('='.repeat(50));

  for (const bucket of BUCKETS) {
    await migrateBucket(bucket);
  }

  // --- Step 2: Migrate table data ---
  console.log('\n' + '='.repeat(50));
  console.log('STEP 2: MIGRATING TABLE DATA');
  console.log('='.repeat(50));

  let totalRows = 0;
  for (const table of TABLES) {
    const count = await migrateTable(table);
    totalRows += count;
  }

  // --- Summary ---
  console.log('\n' + '='.repeat(50));
  console.log('✅ MIGRATION COMPLETE!');
  console.log(`   Total rows migrated: ${totalRows}`);
  console.log('='.repeat(50));
  console.log('\nNext steps:');
  console.log('1. Update Netlify environment variables');
  console.log('2. git add . && git commit -m "Migrate to new Supabase" && git push');
}

main().catch(err => {
  console.error('💥 Migration failed:', err);
  process.exit(1);
});
