import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

// This is a Higher Order Component (HOC) that wraps any component that requires authentication
export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuth: React.FC<any> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      // Set isClient to true once the component mounts
      setIsClient(true);
      
      // If the user is not authenticated and the auth state is done loading, redirect to login
      if (!isLoading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    // If we're on the server or still loading, return null to prevent flash of content
    if (!isClient || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="mt-4 text-gray-600">Laden...</div>
          </div>
        </div>
      );
    }

    // If user is authenticated, render the wrapped component
    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    // If we reach here, it means we're on the client, not loading, and not authenticated
    // By now, we should be redirecting, but return null just in case
    return null;
  };

  WithAuth.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
};

// Helper function to get display name of a component
function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}