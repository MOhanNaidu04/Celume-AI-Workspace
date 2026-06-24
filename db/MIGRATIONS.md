# Database Migrations Guide

## Overview
This project uses a custom migration system to manage PostgreSQL database schema changes. Migrations are SQL files that are executed in order, with tracking to ensure they only run once.

## Migration Files Location
- Migrations are stored in: `db/migrations/`
- Files should be named with a leading number: `001-*.sql`, `002-*.sql`, etc.
- They are executed in alphabetical/numerical order

## Running Migrations

### First Time Setup
To initialize the database with all schema tables:

```bash
npm run migrate
```

This will:
1. Create a `migrations` table to track executed migrations
2. Read all `.sql` files from `db/migrations/`
3. Execute any migrations that haven't been run yet
4. Record them in the migrations table

### Checking Migration Status
After running migrations, a `migrations` table is created with records of all executed migrations.

Query to see executed migrations:
```sql
SELECT * FROM migrations ORDER BY executed_at;
```

## Adding New Migrations

1. Create a new `.sql` file in `db/migrations/` with a sequential number:
   ```
   db/migrations/002-add-new-table.sql
   ```

2. Write your SQL schema changes in the file

3. Run migrations:
   ```bash
   npm run migrate
   ```

Example migration file:
```sql
-- Migration: Add analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  event_type VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_user_id ON analytics(user_id);
```

## Resetting Database (Development Only)

**WARNING: This will delete all data!**

To reset the database during development:
```bash
npm run migrate:reset
```

This will:
1. Drop all tables
2. Re-run all migrations from scratch

## Environment Variables

Ensure these are set in your `.env` file or environment:

```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=celume_ai_workspace
```

## Current Migrations

- **001-init-schema.sql** - Initial schema creation with:
  - users
  - categories
  - chats
  - messages
  - prompt_templates
  - user_favorites
  - tasks
  - projects
  - Indexes for performance

## Troubleshooting

### Migration Already Exists Error
If you see "duplicate key value violates unique constraint", the migration has already been executed. This is normal and safe to ignore.

### Connection Errors
Make sure PostgreSQL is running and your database credentials are correct in the `.env` file.

### Stuck Migrations
If a migration fails partway through, you may need to manually clean up or check the database state before retrying.

## Best Practices

1. **Always test migrations** before running on production
2. **Keep migrations small** - one logical change per file
3. **Use descriptive names** - `002-add-user-roles-table.sql`
4. **Use IF NOT EXISTS** - makes migrations idempotent when possible
5. **Document complex changes** - add SQL comments
6. **Never modify executed migrations** - create new ones instead
