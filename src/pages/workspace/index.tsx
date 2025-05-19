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
  Brain,
  Shield,
  Package,
  GitBranch,
  Users,
  BarChart3,
  ChevronRight,
  Search,
  Filter,
  Grid,
  List,
  Bell,
  TrendingUp,
  Zap,
  ArrowUpRight,
  MoreVertical,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSidebar = () => (
    <aside className="w-64 bg-neutral-900/50 backdrop-blur-xl text-white h-screen flex flex-col border-r border-white/5">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25 animate-pulse"></div>
            <Globe className="relative h-8 w-8 text-primary-500" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent font-display">
            ClaudeOSaar
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {[
            { id: 'workspaces', icon: Boxes, label: 'Workspaces' },
            { id: 'activity', icon: Activity, label: 'Activity' },
            { id: 'mcp', icon: Brain, label: 'MCP Integration' },
            { id: 'memory-bank', icon: Database, label: 'Memory Bank' },
            { id: 'billing', icon: CreditCard, label: 'Billing' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <li key={item.id}>
              <Button
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab(item.id)}
                fullWidth
                leftIcon={<item.icon className="h-5 w-5" />}
                className="justify-start"
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="primary" className="w-10 h-10 p-0 rounded-full flex items-center justify-center text-lg font-semibold">
            {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
          </Badge>
          <div>
            <p className="font-semibold">{user?.name || user?.email}</p>
            <p className="text-sm text-neutral-400">Free tier</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          fullWidth
          leftIcon={<LogOut className="h-5 w-5" />}
          className="justify-start"
        >
          Sign out
        </Button>
      </div>
    </aside>
  );

  const renderWorkspaces = () => (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Workspaces</h1>
          <p className="text-neutral-400 mt-2">
            Manage your containerized AI development environments
          </p>
        </div>
        <Button
          onClick={createWorkspace}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Create Workspace
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <Card variant="glass" className="text-center py-16">
          <Boxes className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
          <p className="text-neutral-400 mb-6">
            Create your first workspace to start building with Claude
          </p>
          <Button
            onClick={createWorkspace}
            leftIcon={<Plus className="h-5 w-5" />}
          >
            Create your first workspace
          </Button>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredWorkspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="glass" hover="scale">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{workspace.name}</h3>
                        <p className="text-sm text-neutral-400">Created {new Date(workspace.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge 
                        variant={workspace.status === 'running' ? 'success' : 'default'}
                        size="sm"
                      >
                        {workspace.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Cpu className="h-4 w-4" />
                        <span>{workspace.resources.cpu} CPU</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <MemoryStick className="h-4 w-4" />
                        <span>{workspace.resources.memory} RAM</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <HardDrive className="h-4 w-4" />
                        <span>{workspace.resources.storage} Storage</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {workspace.status === 'stopped' ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleWorkspaceAction(workspace.id, 'start')}
                          leftIcon={<Play className="h-4 w-4" />}
                          fullWidth
                        >
                          Start
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleWorkspaceAction(workspace.id, 'stop')}
                          leftIcon={<Pause className="h-4 w-4" />}
                          fullWidth
                        >
                          Stop
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => router.push(`/workspace/${workspace.id}`)}
                        leftIcon={<Terminal className="h-4 w-4" />}
                        fullWidth
                      >
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWorkspaceAction(workspace.id, 'delete')}
                        className="text-red-400 hover:text-red-300"
                        title="Delete workspace"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredWorkspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="glass" hover="lift">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Terminal className="w-10 h-10 text-primary-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{workspace.name}</h3>
                          <p className="text-sm text-neutral-400">
                            {workspace.resources.cpu} CPU • {workspace.resources.memory} RAM • {workspace.resources.storage} Storage
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={workspace.status === 'running' ? 'success' : 'default'}
                        >
                          {workspace.status}
                        </Badge>
                        
                        <div className="flex items-center gap-2">
                          {workspace.status === 'stopped' ? (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleWorkspaceAction(workspace.id, 'start')}
                              leftIcon={<Play className="h-4 w-4" />}
                            >
                              Start
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleWorkspaceAction(workspace.id, 'stop')}
                              leftIcon={<Pause className="h-4 w-4" />}
                            >
                              Stop
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => router.push(`/workspace/${workspace.id}`)}
                            leftIcon={<Terminal className="h-4 w-4" />}
                          >
                            Open
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWorkspaceAction(workspace.id, 'delete')}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Resource Usage Summary */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="glass">
          <h2 className="text-xl font-semibold text-white mb-6">Resource Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-neutral-400">CPU Usage</span>
                <span className="text-lg font-semibold text-white">25%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 mt-1">0.5 of 2 cores</p>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-neutral-400">Memory Usage</span>
                <span className="text-lg font-semibold text-white">50%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 mt-1">1GB of 2GB</p>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-neutral-400">Storage Usage</span>
                <span className="text-lg font-semibold text-white">10%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 mt-1">1GB of 10GB</p>
            </div>
          </div>
        </Card>
      </motion.div>
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
              <h1 className="text-3xl font-bold text-white mb-2">MCP Integration</h1>
              <p className="text-neutral-400 mb-8">
                Manage Model Context Protocol tools and configurations
              </p>
            </div>
            <McpDashboard />
          </div>
        );
      case 'activity':
        return (
          <div className="flex-1 p-8">
            <Card variant="glass" className="text-center py-16">
              <Activity className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Activity Logs</h3>
              <p className="text-neutral-400">Coming soon...</p>
            </Card>
          </div>
        );
      case 'memory-bank':
        return (
          <div className="flex-1 p-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Memory Bank</h1>
              <p className="text-neutral-400 mb-8">
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
              <h1 className="text-3xl font-bold text-white mb-2">Subscription & Billing</h1>
              <p className="text-neutral-400 mb-8">
                Manage your subscription plan and billing information
              </p>
            </div>
            <SubscriptionManager />
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 p-8">
            <Card variant="glass" className="text-center py-16">
              <Settings className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
              <p className="text-neutral-400">Coming soon...</p>
            </Card>
          </div>
        );
      default:
        return renderWorkspaces();
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950">
      {renderSidebar()}
      {renderContent()}
    </div>
  );
}

export default withAuth(WorkspaceDashboard);