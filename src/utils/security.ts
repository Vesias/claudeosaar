/**
 * Security utilities for input validation and sanitization
 */

import { z } from 'zod';

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[&'"]/g, (char) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        "'": '&#x27;',
        '"': '&quot;'
      };
      return entities[char] || char;
    })
    .trim();
}

/**
 * Validate workspace name format
 */
export function validateWorkspaceName(name: string): boolean {
  const pattern = /^[a-z0-9-]+$/;
  return pattern.test(name) && name.length >= 3 && name.length <= 30;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Generate secure random string for API keys
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array)
    .map(byte => chars[byte % chars.length])
    .join('');
}

/**
 * Hash password (for demo purposes - use bcrypt in production)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Request validation schemas
 */
export const schemas = {
  workspaceCreate: z.object({
    name: z.string()
      .min(3, 'Name must be at least 3 characters')
      .max(30, 'Name must be at most 30 characters')
      .regex(/^[a-z0-9-]+$/, 'Name must contain only lowercase letters, numbers, and hyphens'),
    tier: z.enum(['free', 'pro', 'enterprise']),
    region: z.string().min(1, 'Region is required'),
    description: z.string().optional()
  }),
  
  authLogin: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  }),
  
  authSignup: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required'),
    acceptedTerms: z.boolean().refine(val => val === true, 'You must accept the terms')
  })
};

/**
 * Validate request body against schema
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

/**
 * Rate limiting configuration
 */
export const rateLimits = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per window
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit auth attempts
  },
  workspace: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // limit workspace creation
  }
};

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://agentland.saarland', 'https://www.agentland.saarland']
    : ['http://localhost:3000', 'http://localhost:6600', 'http://localhost:6601'],
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Security headers
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'Referrer-Policy': 'no-referrer-when-downgrade'
};