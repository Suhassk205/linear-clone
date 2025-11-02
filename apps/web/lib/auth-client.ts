/**
 * Better Auth Client Configuration
 *
 * This client connects to our existing Hono.js backend API
 * We're using Better Auth's React client for UI patterns and session management,
 * but connecting to our custom JWT backend implementation.
 */

import { createAuthClient } from 'better-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Better Auth client instance
 * Configured to work with our existing backend at /api/auth
 */
export const authClient = createAuthClient({
  baseURL: baseURL,
  // Our backend uses /api/auth/* for auth endpoints
  // This matches our existing Hono.js routes
});

/**
 * Export individual hooks and methods for convenience
 */
export const { signIn, signUp, signOut, useSession, getSession, updateUser } = authClient;

/**
 * Custom adapter to bridge Better Auth with our existing API
 * This allows us to use Better Auth UI patterns while maintaining
 * compatibility with our JWT-based backend
 */
export const authAdapter = {
  /**
   * Register a new user
   * Maps Better Auth signup to our POST /api/v1/auth/register endpoint
   */
  async register(data: { email: string; password: string; name: string }) {
    const response = await fetch(`${baseURL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Registration failed');
    }

    return response.json();
  },

  /**
   * Login with email and password
   * Maps to our POST /api/v1/auth/login endpoint
   */
  async login(data: { email: string; password: string }) {
    const response = await fetch(`${baseURL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }

    return response.json();
  },

  /**
   * Logout the current user
   * Maps to our POST /api/v1/auth/logout endpoint
   */
  async logout() {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${baseURL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Logout failed');
    }

    // Clear local storage
    localStorage.removeItem('authToken');

    return response.json();
  },

  /**
   * Get current user session
   * Maps to our GET /api/v1/auth/me endpoint
   */
  async getCurrentUser() {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return null;
    }

    const response = await fetch(`${baseURL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // Token might be expired or invalid
      localStorage.removeItem('authToken');
      return null;
    }

    const data = await response.json();
    return data.data.user;
  },
};
