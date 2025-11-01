import { pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { comments } from './comments';
import { users } from './users';

export const commentReactions = pgTable(
  'comment_reactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    commentId: uuid('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    emoji: varchar('emoji', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueReaction: unique().on(table.commentId, table.userId, table.emoji),
  })
);

export type CommentReaction = typeof commentReactions.$inferSelect;
export type InsertCommentReaction = typeof commentReactions.$inferInsert;
