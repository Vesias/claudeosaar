import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscriptionTier?: 'free' | 'pro' | 'enterprise'; // Added subscriptionTier
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      try {
        // For local development, check for mock token
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedToken) {
          if (storedToken === 'mock_token_for_development') {
            // Load mock user from localStorage
            const mockUserStr = localStorage.getItem('auth_user');
            if (mockUserStr) {
              try {
                const mockUser = JSON.parse(mockUserStr);
                setUser(mockUser);
                setToken(storedToken);
              } catch (e) {
                console.error('Error parsing mock user:', e);
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_token');
              }
            }
          } else {
            // Regular token verification
            try {
              const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: storedToken }),
              });

              if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setToken(storedToken);
              } else {
                // Token is invalid or expired
                localStorage.removeItem('auth_token');
              }
            } catch (error) {
              console.error('Auth verification error:', error);
              localStorage.removeItem('auth_token');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For local development, accept any login
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: '1',
          email: email || 'dev@example.com',
          name: email.split('@')[0] || 'Developer',
          role: 'admin',
          subscriptionTier: 'pro' as 'free' | 'pro' | 'enterprise' // Corrected type
        };
        
        localStorage.setItem('auth_token', 'mock_token_for_development');
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setToken('mock_token_for_development');
        return true;
      }
      
      // Regular API login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
