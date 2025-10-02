# Supabase Storage Setup Guide

Panduan lengkap untuk setup dan konfigurasi Supabase Storage untuk project CodePacker Catalog.

## 📋 Prerequisites

1. **Supabase Project**: Pastikan Anda sudah memiliki project Supabase
2. **Environment Variables**: Konfigurasi yang benar di `.env.local`
3. **Dependencies**: Semua package sudah terinstall

## 🔧 Environment Variables

Pastikan environment variables berikut sudah dikonfigurasi di `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### Cara Mendapatkan Keys:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Pergi ke **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## 📦 Storage Buckets

Berdasarkan analisis schema database, sistem memerlukan 5 storage buckets:

### 1. `profile-photos`
- **Tujuan**: Foto profil siswa
- **Akses**: Public read, authenticated upload
- **Format**: JPEG, PNG, WebP
- **Limit**: 5MB per file

### 2. `skill-icons`
- **Tujuan**: Icon untuk skills
- **Akses**: Public read, authenticated upload
- **Format**: SVG, PNG, JPEG
- **Limit**: 1MB per file

### 3. `techstack-icons`
- **Tujuan**: Icon untuk tech stacks
- **Akses**: Public read, authenticated upload
- **Format**: SVG, PNG, JPEG
- **Limit**: 1MB per file

### 4. `project-thumbnails`
- **Tujuan**: Thumbnail project
- **Akses**: Public read, authenticated upload
- **Format**: JPEG, PNG, WebP
- **Limit**: 10MB per file

### 5. `project-media`
- **Tujuan**: Media files project (gambar, video)
- **Akses**: Public read, authenticated upload
- **Format**: JPEG, PNG, WebP, MP4, WebM
- **Limit**: 50MB per file

## 🚀 Setup Commands

### Automatic Setup (Recommended)

```bash
# Setup semua storage buckets dan policies
npm run storage:setup
```

### Manual Policy Setup (Alternative)

If the automatic policy setup fails, you can create the policies manually:

#### Option 1: Using SQL File
Run the SQL file directly in your Supabase SQL Editor:
```bash
# Copy the content of scripts/setup-storage-policies.sql
# and paste it into your Supabase SQL Editor
```

#### Option 2: Using psql
```bash
psql -h your-supabase-host -U postgres -d postgres -f scripts/setup-storage-policies.sql
```

#### Option 3: Individual Policy Creation
You can also create policies individually using the Supabase dashboard:
1. Go to Authentication > Policies
2. Create policies for each bucket with the following rules:
   - **Public Read**: Allow SELECT for all users
   - **Authenticated Upload**: Allow INSERT for authenticated users
   - **Owner Update/Delete**: Allow UPDATE/DELETE for file owners only

## 📁 File Structure

```
scripts/
├── setup-storage.ts          # Main setup script
src/lib/
├── storage.ts                # Storage utilities
└── schema.ts                 # Database schema (reference)
```

## 🔐 Storage Policies

Script otomatis akan membuat policies berikut untuk setiap bucket:

1. **Public Read**: Semua orang bisa membaca file
2. **Authenticated Upload**: User yang login bisa upload
3. **Owner Update**: User bisa update file miliknya
4. **Owner Delete**: User bisa delete file miliknya

## 💻 Usage Examples

### Upload File

```typescript
import { uploadFile, STORAGE_BUCKETS, generateFilePath } from '@/lib/storage';

// Upload profile photo
const file = event.target.files[0];
const userId = 'user-uuid';
const path = generateFilePath(userId, file.name, 'profile');

const result = await uploadFile({
  bucket: STORAGE_BUCKETS.PROFILE_PHOTOS,
  path,
  file,
  upsert: true
});

if (result.success) {
  console.log('File uploaded:', result.url);
} else {
  console.error('Upload failed:', result.error);
}
```

### Get Public URL

```typescript
import { getPublicUrl, STORAGE_BUCKETS } from '@/lib/storage';

const url = getPublicUrl(STORAGE_BUCKETS.PROFILE_PHOTOS, 'user-id/profile/photo.jpg');
```

### File Validation

```typescript
import { validateFile, FILE_VALIDATION_OPTIONS } from '@/lib/storage';

const validation = validateFile(file, FILE_VALIDATION_OPTIONS.PROFILE_PHOTO);

if (!validation.valid) {
  console.error('Invalid file:', validation.error);
}
```

## 🛠️ Development Workflow

1. **Setup Storage**: `npm run storage:setup`
2. **Test Upload**: Gunakan utility functions di `src/lib/storage.ts`
3. **Verify**: Check Supabase Dashboard → Storage

## 🔍 Troubleshooting

### Error: Missing environment variables
```
❌ Missing Supabase environment variables
```
**Solusi**: Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` sudah diset di `.env.local`

### Error: Failed to connect to Supabase
```
❌ Failed to connect to Supabase: Invalid API key
```
**Solusi**: 
- Periksa kembali API keys di Supabase Dashboard
- Pastikan service role key benar (bukan anon key)

### Error: Bucket already exists
```
✅ Bucket profile-photos already exists
```
**Info**: Ini normal, script akan skip bucket yang sudah ada

### Error: Policy creation failed
```
❌ Error creating policy: permission denied
```
**Solusi**: Pastikan menggunakan service role key, bukan anon key

## 📊 Storage URLs Format

File yang diupload akan memiliki URL format:
```
https://your-project.supabase.co/storage/v1/object/public/{bucket-name}/{file-path}
```

Contoh:
```
https://abc123.supabase.co/storage/v1/object/public/profile-photos/user-123/profile/photo-1640995200000.jpg
```

## 🔗 Related Files

- **Database Schema**: `src/lib/schema.ts` - Field yang memerlukan storage
- **Storage Utils**: `src/lib/storage.ts` - Helper functions
- **Setup Script**: `scripts/setup-storage.ts` - Automatic setup
- **Environment**: `.env.local` - Configuration

## 📝 Notes

- Semua buckets dikonfigurasi sebagai **public** untuk kemudahan akses
- File path menggunakan format: `{userId}/{folder}/{filename-timestamp.ext}`
- Policies memastikan user hanya bisa mengelola file miliknya sendiri
- File validation dilakukan di client-side sebelum upload