# 🎓 CodePacker Catalog

![CodeRabbit Reviews](https://img.shields.io/coderabbit/prs/github/rafapradana/codepacker-catalog?utm_source=oss&utm_medium=github&utm_campaign=rafapradana%2Fcodepacker-catalog&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

> **Web aplikasi katalog & portofolio siswa RPL SMKN 4 Malang**

Platform modern untuk showcase project dan portofolio siswa Rekayasa Perangkat Lunak dengan desain yang clean, responsif, dan user-friendly.

## 🚀 Features

### ✅ **Completed Features**
- 🔐 **Authentication System** - Login/Register dengan Better Auth
- 🗄️ **Database Schema** - PostgreSQL dengan Drizzle ORM
- 👥 **User Management** - Role-based access (Admin/Student)
- 🎨 **Modern UI** - Shadcn/ui components dengan Tailwind CSS
- 📊 **Database Seeding** - Sample data untuk development
- 🔧 **Development Setup** - Hot reload dengan Turbopack

### 🚧 **In Development**
- 📱 **Student Dashboard** - Profile management & project showcase
- 👨‍💼 **Admin Dashboard** - User & content management
- 🎯 **Project CRUD** - Create, read, update, delete projects
- 🔍 **Search & Filter** - Advanced filtering by skills, tech stack, category
- 📁 **File Upload** - Project media dengan Supabase Storage

### 📋 **Planned Features**
- 🌐 **Public Portfolio** - Guest access untuk showcase
- 📈 **Analytics** - Project views & engagement metrics
- 🏷️ **Tagging System** - Categorization & discovery
- 📱 **Mobile App** - React Native companion app

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS 4, Shadcn/ui, Lucide Icons
- **Backend:** Next.js API Routes, Better Auth
- **Database:** PostgreSQL, Drizzle ORM
- **Storage:** Supabase Storage
- **Development:** Turbopack, ESLint, Prettier

## 📁 Project Structure

```
codepacker-catalog/
├── docs/                    # Documentation
│   ├── erd.md              # Database schema
│   ├── prd.md              # Product requirements
│   └── techstack.md        # Technical specifications
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── login/          # Authentication pages
│   │   └── register/
│   ├── components/         # Reusable components
│   │   └── ui/            # Shadcn/ui components
│   └── lib/               # Utilities & configurations
│       ├── auth.ts        # Better Auth config
│       ├── db.ts          # Database connection
│       ├── schema.ts      # Drizzle schema
│       └── seed.ts        # Database seeding
├── drizzle/               # Database migrations
└── scripts/               # Setup scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Supabase account (for storage)

### 1. Clone Repository
```bash
git clone https://github.com/rafapradana/codepacker-catalog.git
cd codepacker-catalog
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local dengan konfigurasi database dan Supabase
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/codepacker_catalog"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Supabase (for file storage)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4. Database Setup
```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# Seed database dengan sample data
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Test Authentication
Login dengan akun sample:
- **Admin:** `admin` / `admin123`
- **Student:** `johndoe` / `student123`

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone**
   ```bash
   git fork https://github.com/rafapradana/codepacker-catalog.git
   git clone https://github.com/YOUR_USERNAME/codepacker-catalog.git
   cd codepacker-catalog
   ```

2. **Setup Development Environment**
   ```bash
   npm install
   cp .env.example .env.local
   # Edit .env.local dengan konfigurasi lokal
   ```

3. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Create Feature Branch**
   ```bash
   git checkout -b feature/nama-fitur
   # atau
   git checkout -b fix/nama-bug
   ```

5. **Development**
   ```bash
   npm run dev  # Start development server
   npm run lint # Check code quality
   ```

6. **Database Changes**
   ```bash
   # Jika mengubah schema
   npm run db:generate  # Generate migration
   npm run db:migrate   # Apply migration
   
   # Reset database (jika perlu)
   npm run db:seed      # Re-seed data
   ```

7. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/nama-fitur
   ```

8. **Create Pull Request**
   - Buat PR ke branch `main`
   - Jelaskan perubahan yang dibuat
   - Screenshot jika ada perubahan UI
   - Pastikan semua checks passed

### Code Standards

- **TypeScript** - Gunakan type safety
- **ESLint** - Follow linting rules
- **Prettier** - Consistent code formatting
- **Conventional Commits** - Use semantic commit messages
- **Component Structure** - Follow Next.js best practices

### Commit Message Format
```
type(scope): description

feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migration
npm run db:migrate   # Apply database migration
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database
npm run storage:setup # Setup Supabase storage
```

## 📚 Documentation

- [📊 ERD](./docs/erd.md) - Database schema & relationships
- [📋 PRD](./docs/prd.md) - Product requirements & features
- [🛠️ Tech Stack](./docs/techstack.md) - Technical specifications
- [🗄️ Database](./README-DATABASE.md) - Database setup & management
- [📁 Storage](./README-STORAGE.md) - File storage configuration
