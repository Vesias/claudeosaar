import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Array<{ id: string; name: string; status: string; lastAccessed: string }>>([]);

  useEffect(() => {
    // Simulate loading workspaces
    const timer = setTimeout(() => {
      setWorkspaces([
        { id: 'ws-1', name: 'Development Workspace', status: 'running', lastAccessed: 'Today at 10:25 AM' },
        { id: 'ws-2', name: 'Research Project', status: 'stopped', lastAccessed: 'Yesterday at 3:40 PM' },
        { id: 'ws-3', name: 'Experimental AI', status: 'paused', lastAccessed: 'May 17, 2025' },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">ClaudeOSaar</h1>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{user.name || 'User'}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Workspaces</h2>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            New Workspace
          </button>
        </div>

        {/* Workspaces Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="workspace-card bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{workspace.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workspace.status === 'running' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    workspace.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {workspace.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last accessed: {workspace.lastAccessed}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Open
                  </button>
                  <button
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded ${
                      workspace.status === 'running' 
                        ? 'text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800' 
                        : 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                    }`}
                  >
                    {workspace.status === 'running' ? 'Stop' : 'Start'}
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Terminal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Sample Terminal */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Terminal Access</h2>
          <div className="terminal-container p-4 font-mono text-sm text-gray-100">
            <div className="mb-2">
              <span className="text-green-400">user@claudeosaar</span>:<span className="text-blue-400">~</span>$ ls -la
            </div>
            <div className="mb-2">
              total 40
            </div>
            <div className="mb-2">
              drwxr-xr-x 5 user user 4096 May 19 10:00 .
            </div>
            <div className="mb-2">
              drwxr-xr-x 3 user user 4096 May 19 10:00 ..
            </div>
            <div className="mb-2">
              drwxr-xr-x 8 user user 4096 May 19 10:00 .claude
            </div>
            <div className="mb-2">
              -rw-r--r-- 1 user user 1204 May 19 10:00 CLAUDE.md
            </div>
            <div className="mb-2">
              drwxr-xr-x 2 user user 4096 May 19 10:00 ai_docs
            </div>
            <div className="mb-2">
              drwxr-xr-x 3 user user 4096 May 19 10:00 src
            </div>
            <div className="mb-2">
              <span className="text-green-400">user@claudeosaar</span>:<span className="text-blue-400">~</span>$ █
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            ClaudeOSaar v2.2.1-dev © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
