```markdown
# NestJS + Supabase (PostgreSQL) + TypeORM API

A robust, scalable backend API built with **NestJS**, **TypeORM**, and **Supabase PostgreSQL**, using **100% manual migrations** (no `synchronize: true` — safe for production).

## Tech Stack

- NestJS 10+
- TypeORM 0.3.x
- Supabase PostgreSQL
- Class Validator & Class Transformer
- Configurable via `.env`
- Manual database migrations (required for Supabase)

---

## Prerequisites

- Node.js ≥ 18
- pnpm (recommended) or npm/yarn
- Supabase account & project
- Git

---

## Project Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd <your-project-name>
pnpm install
# or: npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your Supabase connection:

```env
# Supabase PostgreSQL Connection (Recommended format)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres

# Optional: Individual params (if not using DATABASE_URL)
# DB_HOST=db.YOUR_REF.supabase.co
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=YOUR_PASSWORD
# DB_NAME=postgres

# App
PORT=3000
NODE_ENV=development
```

> **Warning: Never use `synchronize: true` with Supabase in production** — it will fail due to permission restrictions.

---

## Database Migrations (Manual – Required!)

This project uses **manual migrations only**. All schema changes must go through migration files.

### Important Migration Commands (You Must Use These)

| Command                                 | Purpose                                      |
|-----------------------------------------|----------------------------------------------|
| `pnpm run typeorm migration:generate ./src/migrations/YourMigrationName` | Generate migration from entity changes       |
| `pnpm run typeorm migration:create ./src/migrations/YourCustomName`     | Create blank migration (for raw SQL/fixes)   |
| `pnpm run typeorm migration:run`        | Run all pending migrations                   |
| `pnpm run typeorm migration:revert`     | Revert the last applied migration            |
| `pnpm run typeorm schema:sync`          | (Do NOT use in production – for dev only)   |

### Correct Migration Workflow (Follow This Order!)

```bash
# 1. Make changes to your entities (e.g., add new fields, create new entity)

# 2. Generate a migration based on entity changes
pnpm run typeorm migration:generate ./src/migrations/CreateUserTable
# or
pnpm run typeorm migration:generate ./src/migrations/AddEmailToUser

# 3. Review the generated file in src/migrations/ — make adjustments if needed

# 4. Run the migration
pnpm run typeorm migration:run

# 5. Build & start the app
pnpm run build
pnpm run start:prod
```

> **Tip**: Always test migrations locally first (using Docker or local Postgres) before running on Supabase.

---

## Available Scripts (package.json)

```bash
# Development
pnpm run start:dev          # Hot-reload development server

# Production
pnpm run build              # Compile TypeScript to JS
pnpm run start:prod         # Run compiled app

# Migrations (Most Important!)
pnpm run typeorm migration:generate ./src/migrations/Name    # Generate from entities
pnpm run typeorm migration:create ./src/migrations/Name      # Create empty migration
pnpm run typeorm migration:run                               # Apply pending migrations
pnpm run typeorm migration:revert                            # Undo last migration
pnpm run typeorm schema:drop                                 # (Danger) Drop entire schema

# Other
pnpm run lint               # Run ESLint
pnpm run test               # Run Jest tests (if configured)
```

> These commands use `ts-node` + your `data-source.ts` to connect properly.

---

## Local Development with Docker (Optional but Recommended)

Run a local PostgreSQL instance for safe testing:

```bash
docker-compose up -d
```

Update `.env` temporarily:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestjs_local
```

Then run migrations safely before pushing to Supabase.

---

## Supabase Best Practices

- Use the `postgres` role only for migrations (it has full privileges)
- Create a limited-role user (e.g., `app_user`) for your API runtime
- Enable Row Level Security (RLS) on sensitive tables
- Use Supabase Auth? Validate JWTs using `@supabase/auth-helpers` or custom guard

---

## Project Structure

```
src/
├── migrations/              # All migration files (*.ts)
├── entities/                # TypeORM entities
├── modules/                 # Feature modules
├── config/
│   └── data-source.ts       # TypeORM DataSource (used by CLI)
├── app.module.ts
├── main.ts
docker-compose.yml
ormconfig.json (optional)
```

---

## Deployment Notes

1. Run migrations **after** deploy (CI/CD step):
   ```bash
   pnpm run build
   pnpm run typeorm migration:run
   pnpm run start:prod
   ```

2. Recommended platforms:
   - Railway
   - Render
   - Fly.io
   - Vercel (with Serverless Functions – limited)
   - Coolify / CapRover / Docker

---

## Contributing

1. Create feature/fix branch
2. Make entity changes
3. Generate & test migration locally
4. Commit migration file
5. Open Pull Request

> Never commit code without a corresponding migration!

---

## License

MIT © 2025 Your Name / Your Team

---

Built with love for clean, maintainable, Supabase-ready backends.
```

This README is **100% accurate** to your current setup using:

```bash
pnpm run typeorm migration:generate ...
pnpm run typeorm migration:run
```