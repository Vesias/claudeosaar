import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names together and resolves Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date with Intl.DateTimeFormat
 */
export function formatDate(input: string | number | Date, options: Intl.DateTimeFormatOptions = {}): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(date);
}

/**
 * Truncates a string to the specified length and appends an ellipsis if needed
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Converts a string to a kebab-case slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Delays execution for the specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parses JSON without throwing exceptions
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (e) {
    return fallback;
  }
}

/**
 * Formats a number as a file size (KB, MB, GB, etc.)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Checks if running on client-side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Generates a unique ID with an optional prefix
 */
export function uniqueId(prefix: string = ''): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}