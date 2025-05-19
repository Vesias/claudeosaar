import { useState, useEffect } from 'react'
import Link from 'next/link'
import { withAuth } from '@/components/withAuth'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import {
  Plus,
  Server,
  Activity,
  Clock,
  Cpu,
  HardDrive,
  Terminal,
  Package,
  GitBranch,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Filter,
  Grid,
  List,
  Brain,
  Database,
  Code2,
  Users,
  CreditCard,
  Bell,
  Star,
  TrendingUp,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react'

interface Workspace {
  id: string
  name: string
  description?: string
  tier: 'free' | 'pro' | 'enterprise'
  status: 'running' | 'stopped' | 'pending' | 'error'
  resources: {
    cpu: number
    memory: number
    storage: number
  }
  createdAt: string
  updatedAt: string
  metrics?: {
    cpuUsage: number
    memoryUsage: number
    storageUsage: number
  }
}

interface DashboardStats {
  totalWorkspaces: number
  activeWorkspaces: number
  totalStorage: number
  usedStorage: number
  cpuUsage: number
  memoryUsage: number
}

const statusColors = {
  running: 'text-green-400 border-green-400/20 bg-green-400/10',
  stopped: 'text-gray-400 border-gray-400/20 bg-gray-400/10', 
  pending: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
  error: 'text-red-400 border-red-400/20 bg-red-400/10'
}

function Dashboard() {
  const { user, logout } = useAuth()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkspaces: 0,
    activeWorkspaces: 0,
    totalStorage: 100,
    usedStorage: 45,
    cpuUsage: 32,
    memoryUsage: 64
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Mock data for development
      const mockWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'AI Agent Development',
          description: 'Claude-powered agent system with MCP integration',
          tier: 'enterprise',
          status: 'running',
          resources: { cpu: 4, memory: 8, storage: 100 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: { cpuUsage: 45, memoryUsage: 72, storageUsage: 23 }
        },
        {
          id: '2',
          name: 'Web Scraper Bot',
          description: 'Python-based web scraping with AI analysis',
          tier: 'pro',
          status: 'running',
          resources: { cpu: 2, memory: 4, storage: 50 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: { cpuUsage: 23, memoryUsage: 56, storageUsage: 12 }
        },
        {
          id: '3',
          name: 'Test Environment',
          description: 'Development testing workspace',
          tier: 'free',
          status: 'stopped',
          resources: { cpu: 0.5, memory: 1, storage: 5 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: { cpuUsage: 0, memoryUsage: 0, storageUsage: 4 }
        }
      ]
      
      setWorkspaces(mockWorkspaces)
      setStats({
        totalWorkspaces: mockWorkspaces.length,
        activeWorkspaces: mockWorkspaces.filter(w => w.status === 'running').length,
        totalStorage: 155,
        usedStorage: 39,
        cpuUsage: 34,
        memoryUsage: 43
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Loading Dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Terminal className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ClaudeOSaar
                </span>
              </Link>
              <ChevronRight className="w-5 h-5 text-gray-600" />
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user?.name || user?.email}</div>
                  <div className="text-xs text-gray-400 capitalize">{user?.subscriptionTier} Plan</div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-gray-900/50 backdrop-blur-xl min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {[
                { icon: BarChart3, label: 'Overview', href: '#', active: true },
                { icon: Server, label: 'Workspaces', href: '#' },
                { icon: Brain, label: 'AI Agents', href: '#' },
                { icon: Database, label: 'Memory Bank', href: '#' },
                { icon: GitBranch, label: 'Version Control', href: '#' },
                { icon: Package, label: 'Packages', href: '#' },
                { icon: Shield, label: 'Security', href: '#' },
                { icon: CreditCard, label: 'Billing', href: '#' },
                { icon: Settings, label: 'Settings', href: '#' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      item.active
                        ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Server className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">{stats.totalWorkspaces}</span>
              </div>
              <h3 className="text-gray-400 font-medium">Total Workspaces</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-white">{stats.activeWorkspaces}</span>
              </div>
              <h3 className="text-gray-400 font-medium">Active Workspaces</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400 text-sm">
                  {stats.activeWorkspaces} / {stats.totalWorkspaces} Running
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <HardDrive className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">{stats.usedStorage}GB</span>
              </div>
              <h3 className="text-gray-400 font-medium">Storage Used</h3>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div
                  className="bg-purple-400 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.usedStorage / stats.totalStorage) * 100}%` }}
                />
              </div>
              <span className="text-gray-500 text-sm mt-1">
                {stats.usedStorage}GB / {stats.totalStorage}GB
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Cpu className="w-8 h-8 text-orange-400" />
                <span className="text-2xl font-bold text-white">{stats.cpuUsage}%</span>
              </div>
              <h3 className="text-gray-400 font-medium">CPU Usage</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-orange-400 text-sm">Average across workspaces</span>
              </div>
            </motion.div>
          </div>

          {/* Workspaces Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Workspaces</h2>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <Link
                  href="/workspace/new"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Workspace
                </Link>
              </div>
            </div>

            {/* Workspaces Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkspaces.map(workspace => (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-800/50 border border-white/10 rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer"
                  >
                    <Link href={`/workspace/${workspace.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <Terminal className="w-8 h-8 text-blue-400" />
                        <div className={`px-2 py-1 rounded-full text-xs ${statusColors[workspace.status]}`}>
                          {workspace.status}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{workspace.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{workspace.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Cpu className="w-4 h-4" />
                          <span>{workspace.resources.cpu} vCPU</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-4 h-4" />
                          <span>{workspace.resources.memory}GB</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="w-4 h-4" />
                          <span>{workspace.resources.storage}GB</span>
                        </div>
                      </div>
                      
                      {workspace.metrics && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Resource Usage</span>
                            <span className="text-gray-400">
                              {Math.round((workspace.metrics.cpuUsage + workspace.metrics.memoryUsage) / 2)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full transition-all"
                              style={{ 
                                width: `${Math.round((workspace.metrics.cpuUsage + workspace.metrics.memoryUsage) / 2)}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Create New Workspace Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800/50 border border-white/10 border-dashed rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Link href="/workspace/new" className="text-center">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-400">Create New Workspace</h3>
                    <p className="text-sm text-gray-500 mt-1">Deploy a new development environment</p>
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWorkspaces.map(workspace => (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/50 border border-white/10 rounded-xl p-4 hover:bg-gray-800/70 transition-all"
                  >
                    <Link href={`/workspace/${workspace.id}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Terminal className="w-10 h-10 text-blue-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{workspace.name}</h3>
                          <p className="text-gray-400 text-sm">{workspace.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Cpu className="w-4 h-4" />
                            <span>{workspace.resources.cpu} vCPU</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="w-4 h-4" />
                            <span>{workspace.resources.memory}GB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="w-4 h-4" />
                            <span>{workspace.resources.storage}GB</span>
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1.5 rounded-full text-sm ${statusColors[workspace.status]}`}>
                          {workspace.status}
                        </div>
                        
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Brain className="w-10 h-10 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Agents</h3>
                  <p className="text-gray-400 text-sm">Manage your Claude agents</p>
                </div>
              </div>
              <Link href="/agents" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                View Agents <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-10 h-10 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Security</h3>
                  <p className="text-gray-400 text-sm">Monitor your workspace security</p>
                </div>
              </div>
              <Link href="/security" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                Security Settings <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <CreditCard className="w-10 h-10 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Billing</h3>
                  <p className="text-gray-400 text-sm">Manage subscription & usage</p>
                </div>
              </div>
              <Link href="/billing" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                View Billing <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default withAuth(Dashboard)