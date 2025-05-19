import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

// Simple protected route component that works for development
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!isLoading && !isAuthenticated && router.pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="mt-4 text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // If authenticated or on login page, render children
  if (isAuthenticated || router.pathname === '/login') {
    return <>{children}</>;
  }

  // Fallback empty state during redirect
  return null;
}