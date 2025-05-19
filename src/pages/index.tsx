import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ClaudeOSaar</h1>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{user?.name || 'User'}</span>
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to ClaudeOSaar
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            AI Development Workspace OS
          </p>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Containerized Workspaces</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Isolated Docker-based environments with integrated Claude CLI support.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">MCP Integration</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Model Context Protocol for enhanced AI capabilities and tool integration.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Memory Bank</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Persistent context storage and retrieval system for AI development.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Multi-tenant Support</h3>
                <p className="mt-2 text-sm text-gray-500">
                  User isolation with resource limits based on subscription tier.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <button
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            ClaudeOSaar v2.2.1-dev © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}