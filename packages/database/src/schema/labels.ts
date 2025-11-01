import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { teams } from './teams';

export const labels = pgTable('labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }).notNull().default('#6366f1'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Label = typeof labels.$inferSelect;
export type InsertLabel = typeof labels.$inferInsert;
