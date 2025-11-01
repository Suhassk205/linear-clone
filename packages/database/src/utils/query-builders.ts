import { type SQL, and, asc, desc, eq, ilike, inArray, or } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

/**
 * Build filter conditions for issue queries
 */
export interface IssueFilters {
  status?: Array<'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled'>;
  priority?: Array<'none' | 'low' | 'medium' | 'high' | 'urgent'>;
  assigneeIds?: string[];
  creatorIds?: string[];
  labelIds?: string[];
  projectIds?: string[];
  cycleIds?: string[];
  archived?: boolean;
  search?: string;
}

/**
 * Build WHERE clause from issue filters
 */
export function buildIssueFilters(
  filters: IssueFilters,
  columns: {
    status: PgColumn;
    priority: PgColumn;
    assigneeId: PgColumn;
    creatorId: PgColumn;
    projectId: PgColumn;
    cycleId: PgColumn;
    archived: PgColumn;
    title: PgColumn;
    identifier: PgColumn;
  }
): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];

  if (filters.status && filters.status.length > 0) {
    conditions.push(inArray(columns.status, filters.status));
  }

  if (filters.priority && filters.priority.length > 0) {
    conditions.push(inArray(columns.priority, filters.priority));
  }

  if (filters.assigneeIds && filters.assigneeIds.length > 0) {
    conditions.push(inArray(columns.assigneeId, filters.assigneeIds));
  }

  if (filters.creatorIds && filters.creatorIds.length > 0) {
    conditions.push(inArray(columns.creatorId, filters.creatorIds));
  }

  if (filters.projectIds && filters.projectIds.length > 0) {
    conditions.push(inArray(columns.projectId, filters.projectIds));
  }

  if (filters.cycleIds && filters.cycleIds.length > 0) {
    conditions.push(inArray(columns.cycleId, filters.cycleIds));
  }

  if (filters.archived !== undefined) {
    conditions.push(eq(columns.archived, filters.archived));
  }

  if (filters.search) {
    conditions.push(
      or(
        ilike(columns.title, `%${filters.search}%`),
        ilike(columns.identifier, `%${filters.search}%`)
      )
    );
  }

  const validConditions = conditions.filter((c): c is SQL => c !== undefined);
  return validConditions.length > 0 ? and(...validConditions) : undefined;
}

/**
 * Sorting options for queries
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Build ORDER BY clause from sort options
 */
export function buildOrderBy(sortOptions: SortOptions, column: PgColumn): SQL {
  return sortOptions.direction === 'asc' ? asc(column) : desc(column);
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Calculate offset for pagination
 */
export function calculateOffset(pagination: PaginationOptions): number {
  return (pagination.page - 1) * pagination.pageSize;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  totalCount: number,
  options: PaginationOptions
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page: options.page,
      pageSize: options.pageSize,
      totalPages: Math.ceil(totalCount / options.pageSize),
      totalCount,
    },
  };
}
