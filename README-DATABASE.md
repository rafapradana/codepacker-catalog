# Database Setup Guide

This document provides instructions for setting up and managing the database for the Codepacker Catalog project.

## Prerequisites

- PostgreSQL database server
- Node.js and npm installed
- Environment variables configured

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/codepacker_catalog"

# Other required variables (see .env.example for complete list)
```

## Database Commands

The following npm scripts are available for database management:

### Generate Migration Files
```bash
npm run db:generate
```
Generates SQL migration files based on schema changes in `src/lib/schema.ts`.

### Run Migrations
```bash
npm run db:migrate
```
Applies pending migrations to the database.

### Push Schema (Development)
```bash
npm run db:push
```
Pushes schema changes directly to the database without generating migration files. **Use only in development.**

### Database Studio
```bash
npm run db:studio
```
Opens Drizzle Studio for visual database management and querying.

### Seed Database
```bash
npm run db:seed
```
Populates the database with initial sample data including:
- Sample classes (XII RPL 1, XII RPL 2, XI RPL 1, XI RPL 2)
- Categories (Web App, Mobile App, Desktop App, Game, CLI Tool)
- Skills (JavaScript, TypeScript, React, Node.js, Python, PHP, Java, UI/UX Design)
- Tech stacks (Next.js, React, Vue.js, Laravel, Express.js, PostgreSQL, MySQL, TailwindCSS, Flutter, React Native)
- Admin user (username: `admin`, password: `admin123`)
- Sample student user (username: `johndoe`, password: `student123`)

## Database Schema

The database consists of the following main tables:

### Core Tables
- **users**: Base user authentication and role management
- **students**: Student profile information and settings
- **admins**: Administrator profile information
- **classes**: School classes (XII RPL 1, XI RPL 2, etc.)

### Content Tables
- **projects**: Student project portfolios
- **categories**: Project categories with color theming
- **skills**: Student skills with visual styling
- **techstacks**: Technology stacks with visual styling

### Relationship Tables
- **student_skills**: Many-to-many relationship between students and skills
- **project_techstacks**: Many-to-many relationship between projects and tech stacks
- **project_media**: Project media files (images, videos)

## Setup Instructions

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE codepacker_catalog;
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Generate and Run Initial Migration**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Seed Database with Sample Data**
   ```bash
   npm run db:seed
   ```

5. **Verify Setup**
   ```bash
   npm run db:studio
   ```
   This will open Drizzle Studio where you can verify the tables and data.

## Development Workflow

1. **Making Schema Changes**
   - Edit `src/lib/schema.ts`
   - Run `npm run db:generate` to create migration files
   - Run `npm run db:migrate` to apply changes

2. **Quick Development Changes**
   - For rapid prototyping, use `npm run db:push`
   - This bypasses migration files and pushes schema directly

3. **Production Deployment**
   - Always use migration files for production
   - Never use `db:push` in production
   - Test migrations in staging environment first

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format and credentials
- Ensure database exists

### Migration Issues
- Check for syntax errors in schema.ts
- Verify foreign key relationships
- Use `npm run db:studio` to inspect current state

### Seeding Issues
- Ensure migrations are applied first
- Check for unique constraint violations
- Verify all required dependencies are installed

## File Structure

```
├── src/lib/
│   ├── db.ts          # Database connection configuration
│   ├── schema.ts      # Drizzle ORM schema definitions
│   └── seed.ts        # Database seeding script
├── drizzle/           # Generated migration files
├── drizzle.config.ts  # Drizzle Kit configuration
└── .env.local         # Environment variables (not in git)
```