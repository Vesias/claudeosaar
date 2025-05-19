/**
 * Authentication related type definitions
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface SignupRequest extends AuthRequest {
  name: string;
  acceptedTerms: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  subscriptionTier: string;
  iat: number;
  exp: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_FAILURE'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: string }
  | { type: 'CLEAR_ERROR' };