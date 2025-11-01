import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { comments } from './comments';
import { issues } from './issues';
import { users } from './users';

export const attachments = pgTable('attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  issueId: uuid('issue_id').references(() => issues.id, { onDelete: 'cascade' }),
  commentId: uuid('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  filename: varchar('filename', { length: 500 }).notNull(),
  url: varchar('url', { length: 1000 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = typeof attachments.$inferInsert;
