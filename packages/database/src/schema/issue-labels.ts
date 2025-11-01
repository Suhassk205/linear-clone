import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { issues } from './issues';
import { labels } from './labels';

export const issueLabels = pgTable('issue_labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  issueId: uuid('issue_id')
    .notNull()
    .references(() => issues.id, { onDelete: 'cascade' }),
  labelId: uuid('label_id')
    .notNull()
    .references(() => labels.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type IssueLabel = typeof issueLabels.$inferSelect;
export type InsertIssueLabel = typeof issueLabels.$inferInsert;
