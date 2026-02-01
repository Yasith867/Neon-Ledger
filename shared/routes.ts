import { z } from 'zod';

// Minimal routes file as requested for frontend-only app
// We are not using a backend server for API routes, but this file is required by the project structure.

export const api = {};
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  return path;
}
