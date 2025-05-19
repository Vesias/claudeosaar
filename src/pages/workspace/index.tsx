import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { withAuth } from '../../components/withAuth';
import { McpDashboard } from '../../components/McpDashboard';
import { MemoryBank } from '../../components/MemoryBank';
import { SubscriptionManager } from '../../components/SubscriptionManager';
import { 
  Boxes, 
  Plus, 
  Server, 
  Activity,
  Database,
  CreditCard,
  Settings,
  User,
  LogOut,
  Terminal,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Brain
} from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'pending';
  createdAt: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  lastActivity: string;
}

function WorkspaceDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workspaces');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      // Mock data for development
      const mockWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'dev-workspace-1',
          status: 'running',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          resources: {
            cpu: '0.5',
            memory: '512MB',
            storage: '5GB'
          },
          lastActivity: '2 hours ago'
        },
        {
          id: '2',
          name: 'test-environment',
          status: 'stopped',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          resources: {
            cpu: '0.5',
            memory: '512MB',
            storage: '5GB'
          },
          lastActivity: '3 days ago'
        }
      ];
      setWorkspaces(mockWorkspaces);
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = () => {
    router.push('/workspace/new');
  };

  const handleWorkspaceAction = (workspaceId: string, action: 'start' | 'stop' | 'delete') => {
    console.log(`${action} workspace ${workspaceId}`);
    // Implement workspace actions
  };

  const renderSidebar = () => (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">ClaudeOSaar</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab('workspaces')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'workspaces' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Boxes className="h-5 w-5" />
              Workspaces
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'activity' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Activity className="h-5 w-5" />
              Activity
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('mcp')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'mcp' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Brain className="h-5 w-5" />
              MCP Integration
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('memory-bank')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'memory-bank' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Database className="h-5 w-5" />
              Memory Bank
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'billing' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <CreditCard className="h-5 w-5" />
              Billing
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'settings' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">{user?.name || user?.email}</p>
            <p className="text-sm text-gray-400">Free tier</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white
                   hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </aside>
  );

  const renderWorkspaces = () => (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Workspaces</h1>
          <p className="text-gray-600 mt-2">
            Manage your containerized AI development environments
          </p>
        </div>
        <button
          onClick={createWorkspace}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                   transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Workspace
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-16">
          <Boxes className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first workspace to start building with Claude
          </p>
          <button
            onClick={createWorkspace}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                     transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create your first workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
                  <p className="text-sm text-gray-500">Created {new Date(workspace.createdAt).toLocaleDateString()}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    workspace.status === 'running'
                      ? 'bg-green-100 text-green-800'
                      : workspace.status === 'stopped'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {workspace.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Cpu className="h-4 w-4" />
                  <span>{workspace.resources.cpu} CPU</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MemoryStick className="h-4 w-4" />
                  <span>{workspace.resources.memory} RAM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HardDrive className="h-4 w-4" />
                  <span>{workspace.resources.storage} Storage</span>
                </div>
              </div>

              <div className="flex gap-2">
                {workspace.status === 'stopped' ? (
                  <button
                    onClick={() => handleWorkspaceAction(workspace.id, 'start')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 
                             transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={() => handleWorkspaceAction(workspace.id, 'stop')}
                    className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 
                             transition-colors flex items-center justify-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Stop
                  </button>
                )}
                <Link
                  href={`/workspace/${workspace.id}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                           transition-colors flex items-center justify-center gap-2"
                >
                  <Terminal className="h-4 w-4" />
                  Open
                </Link>
                <button
                  onClick={() => handleWorkspaceAction(workspace.id, 'delete')}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                  title="Delete workspace"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Usage Summary */}
      <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-lg font-semibold">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">0.5 of 2 cores</p>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-lg font-semibold">50%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">1GB of 2GB</p>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-600">Storage Usage</span>
              <span className="text-lg font-semibold">10%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">1GB of 10GB</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'workspaces':
        return renderWorkspaces();
      case 'mcp':
        return (
          <div className="flex-1 p-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MCP Integration</h1>
              <p className="text-gray-600 mb-8">
                Manage Model Context Protocol tools and configurations
              </p>
            </div>
            <McpDashboard />
          </div>
        );
      case 'activity':
        return <div className="flex-1 p-8">Activity logs coming soon...</div>;
      case 'memory-bank':
        return (
          <div className="flex-1 p-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Memory Bank</h1>
              <p className="text-gray-600 mb-8">
                Store and manage context, documentation, and knowledge
              </p>
            </div>
            <MemoryBank />
          </div>
        );
      case 'billing':
        return (
          <div className="flex-1 p-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
              <p className="text-gray-600 mb-8">
                Manage your subscription plan and billing information
              </p>
            </div>
            <SubscriptionManager />
          </div>
        );
      case 'settings':
        return <div className="flex-1 p-8">Settings page coming soon...</div>;
      default:
        return renderWorkspaces();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {renderSidebar()}
      {renderContent()}
    </div>
  );
}

export default withAuth(WorkspaceDashboard);