import { index, jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { workspaces } from './workspaces';

export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    entityType: varchar('entity_type', { length: 50 })
      .notNull()
      .$type<'issue' | 'project' | 'cycle' | 'comment' | 'team' | 'workspace'>(),
    entityId: uuid('entity_id').notNull(),
    action: varchar('action', { length: 50 })
      .notNull()
      .$type<'created' | 'updated' | 'deleted' | 'commented' | 'archived' | 'restored'>(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdIdx: index('activity_logs_workspace_id_idx').on(table.workspaceId),
    entityIdIdx: index('activity_logs_entity_id_idx').on(table.entityId),
    createdAtIdx: index('activity_logs_created_at_idx').on(table.createdAt),
  })
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
