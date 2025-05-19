/**
 * Improved Authentication Context with better security and error handling
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { 
  User, 
  AuthState, 
  AuthAction, 
  AuthError,
  AuthResponse 
} from '../types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6600';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };
    
    case 'REFRESH_TOKEN':
      return {
        ...state,
        token: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

// Auth context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token management utilities
const tokenManager = {
  getToken: (): string | null => {
    // Use httpOnly cookies in production, localStorage for dev
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
  
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },
  
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },
  
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  }
};

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  
  // Add auth token to requests
  apiClient.interceptors.request.use(
    (config) => {
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Handle auth errors and token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && originalRequest) {
        // Try to refresh token
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          // Redirect to login
          dispatch({ type: 'LOGOUT' });
          router.push('/login');
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password
      });
      
      const { token, refreshToken } = response.data;
      
      // Store tokens securely
      tokenManager.setToken(token);
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      });
      
      // Redirect to dashboard
      router.push('/workspace');
    } catch (error) {
      const authError: AuthError = {
        code: 'LOGIN_FAILED',
        message: 'Invalid email or password',
        details: undefined
      };
      
      if (axios.isAxiosError(error)) {
        authError.message = error.response?.data?.message || authError.message;
        authError.code = error.response?.data?.code || authError.code;
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: authError
      });
      
      throw authError;
    }
  }, [router]);
  
  // Logout function
  const logout = useCallback(() => {
    // Clear tokens
    tokenManager.removeToken();
    
    // Clear state
    dispatch({ type: 'LOGOUT' });
    
    // Redirect to home
    router.push('/');
  }, [router]);
  
  // Register function
  const register = useCallback(async (
    email: string,
    password: string,
    name: string
  ) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        email,
        password,
        name
      });
      
      const { token, refreshToken } = response.data;
      
      // Store tokens
      tokenManager.setToken(token);
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      });
      
      // Redirect to dashboard
      router.push('/workspace');
    } catch (error) {
      const authError: AuthError = {
        code: 'REGISTRATION_FAILED',
        message: 'Registration failed',
        details: undefined
      };
      
      if (axios.isAxiosError(error)) {
        authError.message = error.response?.data?.message || authError.message;
        authError.code = error.response?.data?.code || authError.code;
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: authError
      });
      
      throw authError;
    }
  }, [router]);
  
  // Refresh token function
  const refreshToken = useCallback(async (): Promise<string | null> => {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }
    
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh', {
        refreshToken
      });
      
      const { token } = response.data;
      tokenManager.setToken(token);
      
      dispatch({
        type: 'REFRESH_TOKEN',
        payload: token
      });
      
      return token;
    } catch (error) {
      // Clear tokens on refresh failure
      tokenManager.removeToken();
      dispatch({ type: 'LOGOUT' });
      return null;
    }
  }, []);
  
  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenManager.getToken();
      
      if (token) {
        try {
          const response = await apiClient.get<{ user: User }>('/auth/user');
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.user,
              token,
              expiresIn: 3600 // Default 1 hour
            }
          });
        } catch (error) {
          // Invalid token, clear it
          tokenManager.removeToken();
          dispatch({ type: 'LOGIN_FAILURE', payload: { code: 'SESSION_EXPIRED', message: 'Session expired' } });
        }
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: { code: 'NO_SESSION', message: 'No session' } });
      }
    };
    
    checkAuth();
  }, []);
  
  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshToken,
    clearError
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireRole?: string[];
    redirectTo?: string;
  }
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(options?.redirectTo || '/login');
      }
      
      if (user && options?.requireRole) {
        const hasRequiredRole = options.requireRole.includes(user.role);
        if (!hasRequiredRole) {
          router.push('/unauthorized');
        }
      }
    }, [isAuthenticated, isLoading, user, router]);
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return null;
    }
    
    return <Component {...props} />;
  };
}