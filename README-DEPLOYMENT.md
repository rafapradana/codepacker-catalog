# Deployment Guide untuk Jagoan Cloud

## Masalah yang Ditemukan

1. **NODE_ENV Warning**: Next.js mendeteksi nilai NODE_ENV yang non-standard
2. **Turbopack Error**: Turbopack mengalami masalah dengan CSS processing di environment production

## Solusi

### 1. Konfigurasi Environment Variables

Pastikan file `.env` di production memiliki konfigurasi yang benar:

```bash
# Environment Configuration
NODE_ENV="production"

# Database Configuration
DATABASE_URL="your_production_database_url"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"

# Redis Configuration
UPSTASH_REDIS_REST_URL="your_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_redis_token"

# AI Configuration
GEMINI_API_KEY="your_gemini_api_key"
```

### 2. Build Commands untuk Production

Gunakan command berikut untuk build di Jagoan Cloud:

```bash
# Untuk development (dengan Turbopack)
npm run dev

# Untuk production build (tanpa Turbopack)
npm run build:prod

# Start production server
npm run start
```

### 3. Deployment Steps di Jagoan Cloud

1. **Upload kode** ke server Jagoan Cloud
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Setup environment variables** sesuai dengan konfigurasi production
4. **Build aplikasi**:
   ```bash
   npm run build:prod
   ```
5. **Start aplikasi**:
   ```bash
   npm run start
   ```

### 4. Troubleshooting

#### Jika masih ada error Turbopack:
- Pastikan menggunakan `npm run build:prod` bukan `npm run build`
- Periksa file `globals.css` menggunakan format Tailwind yang standard

#### Jika ada error NODE_ENV:
- Pastikan NODE_ENV di `.env` production adalah "production"
- Jangan set NODE_ENV ke nilai custom seperti "staging" atau "prod"

#### Jika ada error CSS:
- Pastikan `tw-animate-css` dikonfigurasi sebagai plugin di `tailwind.config.ts`
- Gunakan `@tailwind` directives bukan `@import` di `globals.css`

## Perbedaan dengan Vercel

Vercel memiliki optimisasi khusus untuk Next.js dan Turbopack, sedangkan Jagoan Cloud menggunakan environment Node.js standard. Oleh karena itu:

1. **Vercel**: Bisa menggunakan Turbopack tanpa masalah
2. **Jagoan Cloud**: Lebih baik menggunakan build standard Next.js tanpa Turbopack

## Environment Variables yang Diperlukan

Pastikan semua environment variables berikut sudah dikonfigurasi di Jagoan Cloud:

- `NODE_ENV=production`
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `GEMINI_API_KEY`