import {
  type AnyPgColumn,
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { cycles } from './cycles';
import { projects } from './projects';
import { teams } from './teams';
import { users } from './users';

export const issues = pgTable(
  'issues',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
    cycleId: uuid('cycle_id').references(() => cycles.id, { onDelete: 'set null' }),
    identifier: varchar('identifier', { length: 50 }).notNull(),
    title: varchar('title', { length: 500 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 50 })
      .notNull()
      .default('backlog')
      .$type<'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled'>(),
    priority: varchar('priority', { length: 50 })
      .notNull()
      .default('none')
      .$type<'none' | 'low' | 'medium' | 'high' | 'urgent'>(),
    assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
    creatorId: uuid('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: uuid('parent_id').references((): AnyPgColumn => issues.id, {
      onDelete: 'cascade',
    }),
    dueDate: date('due_date'),
    estimate: integer('estimate'),
    sortOrder: doublePrecision('sort_order').notNull().default(0),
    archived: boolean('archived').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    teamIdIdx: index('issues_team_id_idx').on(table.teamId),
    projectIdIdx: index('issues_project_id_idx').on(table.projectId),
    cycleIdIdx: index('issues_cycle_id_idx').on(table.cycleId),
    assigneeIdIdx: index('issues_assignee_id_idx').on(table.assigneeId),
    statusIdx: index('issues_status_idx').on(table.status),
    createdAtIdx: index('issues_created_at_idx').on(table.createdAt),
    identifierIdx: index('issues_identifier_idx').on(table.identifier),
  })
);

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = typeof issues.$inferInsert;
