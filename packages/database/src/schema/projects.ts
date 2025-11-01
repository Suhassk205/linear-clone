import { boolean, date, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { teams } from './teams';
import { users } from './users';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 })
    .notNull()
    .default('planned')
    .$type<'planned' | 'in_progress' | 'completed' | 'cancelled'>(),
  startDate: date('start_date'),
  targetDate: date('target_date'),
  leadId: uuid('lead_id').references(() => users.id, { onDelete: 'set null' }),
  color: varchar('color', { length: 7 }).notNull().default('#6366f1'),
  archived: boolean('archived').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
