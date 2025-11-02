/**
 * Centralized API exports
 * Import all API modules from here for clean imports
 */

export * from './client';
export * from './auth';
export * from './workspaces';
export * from './issues';

// Re-export everything as a single api object
import { authApi } from './auth';
import { issueApi } from './issues';
import { workspaceApi } from './workspaces';

export const api = {
  auth: authApi,
  workspaces: workspaceApi,
  issues: issueApi,
};
