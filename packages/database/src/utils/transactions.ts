import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { db } from '../client';
import type * as schema from '../schema';

type TransactionType = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/**
 * Execute a function within a database transaction.
 * If the function throws an error, the transaction will be rolled back.
 * @param callback - The function to execute within the transaction
 * @returns The result of the callback function
 */
export async function withTransaction<T>(
  callback: (tx: TransactionType) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    return await callback(tx);
  });
}

/**
 * Execute multiple operations in a transaction with automatic rollback on error.
 * @param operations - Array of operations to execute
 * @returns Array of results from all operations
 */
export async function executeInTransaction<T extends unknown[]>(
  ...operations: Array<(tx: TransactionType) => Promise<unknown>>
): Promise<T> {
  return withTransaction(async (tx) => {
    const results = await Promise.all(operations.map((op) => op(tx)));
    return results as T;
  });
}
