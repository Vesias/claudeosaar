import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  MoreVertical,
  Sparkles
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

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
  stopped: 'text-neutral-400 border-neutral-400/20 bg-neutral-400/10', 
  pending: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
  error: 'text-red-400 border-red-400/20 bg-red-400/10'
}

const tierGradients = {
  free: 'from-neutral-600 to-neutral-800',
  pro: 'from-primary-600 to-accent-600',
  enterprise: 'from-accent-600 to-accent-800'
}

function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-pulse text-3xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-pink-400 bg-clip-text text-transparent">
          Loading Dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25 animate-pulse"></div>
                  <Globe className="relative w-8 h-8 text-primary-500" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent font-display">
                  ClaudeOSaar
                </span>
              </Link>
              <ChevronRight className="w-5 h-5 text-neutral-600" />
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="glass" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 border-neutral-900"></span>
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user?.name || user?.email}</div>
                  <div className="text-xs text-neutral-400 capitalize">{user?.subscriptionTier} Plan</div>
                </div>
                <Badge variant="primary" className="w-10 h-10 p-0 rounded-full flex items-center justify-center text-lg font-semibold">
                  {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-neutral-900/50 backdrop-blur-xl min-h-screen">
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
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                      item.active
                        ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 text-primary-400 border-l-2 border-primary-400'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={logout}
              fullWidth
              leftIcon={<LogOut className="w-5 h-5" />}
              className="justify-start"
            >
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="glass" hover="lift">
                <div className="flex items-center justify-between mb-4">
                  <Server className="w-8 h-8 text-primary-400" />
                  <span className="text-2xl font-bold text-white">{stats.totalWorkspaces}</span>
                </div>
                <h3 className="text-neutral-400 font-medium">Total Workspaces</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success" size="sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                  <span className="text-neutral-500 text-sm">vs last month</span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" hover="lift">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-white">{stats.activeWorkspaces}</span>
                </div>
                <h3 className="text-neutral-400 font-medium">Active Workspaces</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-green-400 text-sm">
                    {stats.activeWorkspaces} / {stats.totalWorkspaces} Running
                  </span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" hover="lift">
                <div className="flex items-center justify-between mb-4">
                  <HardDrive className="w-8 h-8 text-accent-400" />
                  <span className="text-2xl font-bold text-white">{stats.usedStorage}GB</span>
                </div>
                <h3 className="text-neutral-400 font-medium">Storage Used</h3>
                <div className="w-full bg-neutral-800 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full transition-all"
                    style={{ width: `${(stats.usedStorage / stats.totalStorage) * 100}%` }}
                  />
                </div>
                <span className="text-neutral-500 text-sm mt-1">
                  {stats.usedStorage}GB / {stats.totalStorage}GB
                </span>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" hover="lift">
                <div className="flex items-center justify-between mb-4">
                  <Cpu className="w-8 h-8 text-orange-400" />
                  <span className="text-2xl font-bold text-white">{stats.cpuUsage}%</span>
                </div>
                <h3 className="text-neutral-400 font-medium">CPU Usage</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-orange-400 text-sm">Average across workspaces</span>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Workspaces Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Workspaces</h2>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-neutral-900/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-400 transition-all"
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

                <Button
                  onClick={() => router.push('/workspace/new')}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  New Workspace
                </Button>
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
                  >
                    <Card variant="gradient" hover="scale" gradient={tierGradients[workspace.tier]}>
                      <Link href={`/workspace/${workspace.id}`}>
                        <div className="flex items-start justify-between mb-4">
                          <Terminal className="w-8 h-8 text-white" />
                          <Badge variant={workspace.status === 'running' ? 'success' : 'default'} size="sm">
                            {workspace.status}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">{workspace.name}</h3>
                        <p className="text-neutral-300 text-sm mb-4">{workspace.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
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
                              <span className="text-neutral-400">Resource Usage</span>
                              <span className="text-neutral-400">
                                {Math.round((workspace.metrics.cpuUsage + workspace.metrics.memoryUsage) / 2)}%
                              </span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-1.5 mt-2">
                              <div
                                className="bg-gradient-to-r from-primary-400 to-accent-400 h-1.5 rounded-full transition-all"
                                style={{ 
                                  width: `${Math.round((workspace.metrics.cpuUsage + workspace.metrics.memoryUsage) / 2)}%` 
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Link>
                    </Card>
                  </motion.div>
                ))}
                
                {/* Create New Workspace Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card variant="glass" hover="scale" className="h-full">
                    <Link href="/workspace/new" className="h-full flex flex-col items-center justify-center text-center">
                      <Plus className="w-12 h-12 text-neutral-400 mb-3" />
                      <h3 className="text-lg font-medium text-neutral-400">Create New Workspace</h3>
                      <p className="text-sm text-neutral-500 mt-1">Deploy a new development environment</p>
                    </Link>
                  </Card>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWorkspaces.map(workspace => (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card variant="glass" hover="lift">
                      <Link href={`/workspace/${workspace.id}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Terminal className="w-10 h-10 text-primary-400" />
                          <div>
                            <h3 className="text-lg font-semibold text-white">{workspace.name}</h3>
                            <p className="text-neutral-400 text-sm">{workspace.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-4 text-sm text-neutral-500">
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
                          
                          <Badge variant={workspace.status === 'running' ? 'success' : 'default'}>
                            {workspace.status}
                          </Badge>
                          
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card variant="glass" hover="lift">
              <div className="flex items-center gap-4 mb-4">
                <Brain className="w-10 h-10 text-accent-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Agents</h3>
                  <p className="text-neutral-400 text-sm">Manage your Claude agents</p>
                </div>
              </div>
              <Link href="/agents" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
                View Agents <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Card>
            
            <Card variant="glass" hover="lift">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-10 h-10 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Security</h3>
                  <p className="text-neutral-400 text-sm">Monitor your workspace security</p>
                </div>
              </div>
              <Link href="/security" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
                Security Settings <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Card>
            
            <Card variant="glass" hover="lift">
              <div className="flex items-center gap-4 mb-4">
                <CreditCard className="w-10 h-10 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Billing</h3>
                  <p className="text-neutral-400 text-sm">Manage subscription & usage</p>
                </div>
              </div>
              <Link href="/billing" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
                View Billing <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default withAuth(Dashboard)