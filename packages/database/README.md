# @repo/database# Database Package

Shared database package for the Linear Clone application using Drizzle ORM and PostgreSQL.Drizzle ORM schema and migrations for Linear Clone.

## Features## Setup

- **Drizzle ORM**: Type-safe database access with automatic type inference1. Install PostgreSQL 14+

- **PostgreSQL**: Production-grade relational database2. Create a database:

- **Connection Pooling**: Optimized for high-performance queries

- **Transaction Support**: Helper utilities for transaction management ```sql

- **Query Builders**: Reusable query building utilities for complex filters CREATE DATABASE linear_clone;

  ```

  ```

## Setup

3. Copy environment variables:

### Prerequisites

````bash

- PostgreSQL 14+ installed and running   cp .env.example .env

- Node.js 18+   ```

- Environment variables configured

4. Update DATABASE_URL in `.env`

### Environment Variables

## Commands

Create a `.env` file in the root of the monorepo with:

```bash

```env# Generate migrations

DATABASE_URL=postgresql://user:password@localhost:5432/linear_clonenpm run db:generate

````

# Run migrations

### Installationnpm run db:migrate

```bash# Push schema to database (development)

npm installnpm run db:push

```

# Open Drizzle Studio

### Generate Migrationsnpm run db:studio

````

After modifying schema files:

## Structure

```bash

npm run db:generate- `/src/schema` - Database schema definitions

```- `/src/client.ts` - Database client

- `/src/migrate.ts` - Migration runner

### Run Migrations- `/migrations` - Generated migration files


Apply migrations to your database:

```bash
npm run db:migrate
````

### Database Studio

Open Drizzle Studio to inspect your database:

```bash
npm run db:studio
```

## Schema Overview

The database schema includes the following tables:

### Core Tables

- **users**: User accounts and profiles
- **workspaces**: Top-level organizational units
- **workspace_members**: Junction table for workspace membership
- **teams**: Teams within workspaces
- **team_members**: Junction table for team membership

### Project Management

- **projects**: Projects for organizing work
- **cycles**: Time-boxed work cycles (sprints)
- **issues**: Core work items (tasks, bugs, features)
- **labels**: Custom labels for categorization
- **issue_labels**: Junction table for issue labeling

### Collaboration

- **comments**: Comments on issues with threading support
- **comment_reactions**: Emoji reactions to comments
- **attachments**: File attachments for issues and comments

### System

- **activity_logs**: Audit trail of all actions
- **notifications**: User notifications

## Usage

### Import Database Client

```typescript
import { db } from "@repo/database/client";
```

### Import Schema

```typescript
import { users, issues, projects } from "@repo/database/schema";
```

### Query Examples

```typescript
// Select all users
const allUsers = await db.select().from(users);

// Select with filtering
import { eq } from "drizzle-orm";
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, "user@example.com"));

// Insert data
const newUser = await db
  .insert(users)
  .values({
    email: "user@example.com",
    name: "John Doe",
  })
  .returning();
```

### Using Transactions

```typescript
import { withTransaction } from "@repo/database/utils";

const result = await withTransaction(async (tx) => {
  const user = await tx
    .insert(users)
    .values({
      /* ... */
    })
    .returning();
  const workspace = await tx
    .insert(workspaces)
    .values({
      /* ... */
    })
    .returning();
  return { user, workspace };
});
```

### Using Query Builders

```typescript
import { buildIssueFilters } from "@repo/database/utils";
import { issues } from "@repo/database/schema";

const filters = {
  status: ["todo", "in_progress"],
  priority: ["high", "urgent"],
  assigneeIds: ["user-uuid"],
};

const whereClause = buildIssueFilters(filters, issues);
const filteredIssues = await db.select().from(issues).where(whereClause);
```

## Database Indexes

The following indexes are created for optimal query performance:

### Issues Table

- `team_id` - Fast lookups by team
- `project_id` - Fast lookups by project
- `cycle_id` - Fast lookups by cycle
- `assignee_id` - Fast lookups by assignee
- `status` - Fast filtering by status
- `created_at` - Fast sorting by creation date
- `identifier` - Fast lookups by issue identifier (e.g., "ENG-123")

### Other Tables

- Workspace members: `workspace_id`, `user_id`
- Comments: `issue_id`, `created_at`
- Activity logs: `workspace_id`, `entity_id`, `created_at`
- Notifications: `user_id`, `read`, `created_at`

## Scripts

- `db:generate` - Generate migration files from schema changes
- `db:migrate` - Run pending migrations
- `db:push` - Push schema changes directly to database (development only)
- `db:studio` - Open Drizzle Studio
- `lint` - Run Biome linter
- `lint:fix` - Fix linting issues
- `check-types` - Run TypeScript type checking
- `test` - Run tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Generate coverage report

## Type Safety

All tables export TypeScript types:

```typescript
import type { User, InsertUser } from "@repo/database/schema";

// Select type (includes all fields with defaults)
const user: User = {
  id: "uuid",
  email: "user@example.com",
  name: "John Doe",
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Insert type (only required fields)
const newUser: InsertUser = {
  email: "user@example.com",
  name: "John Doe",
};
```

## Development

### Adding a New Table

1. Create a new schema file in `src/schema/` (e.g., `my-table.ts`)
2. Define the table using Drizzle's `pgTable` function
3. Export the table and its TypeScript types
4. Add the export to `src/schema/index.ts`
5. Generate migration: `npm run db:generate`
6. Apply migration: `npm run db:migrate`

### Modifying an Existing Table

1. Update the schema file
2. Generate migration: `npm run db:generate`
3. Review the generated SQL in `migrations/`
4. Apply migration: `npm run db:migrate`

**Important**: Never modify existing migration files. Always create new migrations for schema changes.

## Best Practices

1. **Use Transactions**: Always use transactions for multi-step operations
2. **Add Indexes**: Index foreign keys and frequently queried columns
3. **Validate Input**: Use Zod schemas for runtime validation before database operations
4. **Handle Errors**: Always catch and handle database errors appropriately
5. **Use Connection Pooling**: The client is configured with connection pooling for optimal performance
6. **Type Safety**: Leverage TypeScript types to catch errors at compile time

## Troubleshooting

### Migration Errors

If you encounter migration errors:

1. Check your `DATABASE_URL` environment variable
2. Ensure PostgreSQL is running
3. Verify the database exists
4. Check migration files for SQL errors

### Connection Errors

If you cannot connect to the database:

1. Verify PostgreSQL is running: `pg_isready`
2. Check credentials in `DATABASE_URL`
3. Ensure database exists: `psql -l`
4. Check firewall/network settings

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
