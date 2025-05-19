import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { withAuth } from '@/components/withAuth'
import { motion } from 'framer-motion'
import { 
  Terminal, 
  Code2, 
  Settings, 
  Database, 
  Activity,
  GitBranch,
  Package,
  Users,
  ChevronRight,
  Play,
  Pause,
  RotateCw,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  X,
  Menu,
  Plus,
  Search,
  Filter,
  Zap,
  Cpu,
  HardDrive,
  BarChart3,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

interface Workspace {
  id: string
  name: string
  description?: string
  userId: string
  tier: 'free' | 'pro' | 'enterprise'
  status: 'running' | 'stopped' | 'pending' | 'error'
  dockerId?: string
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
    networkIO: {
      in: number
      out: number
    }
  }
}

const statusColors = {
  running: 'text-green-400 border-green-400/20 bg-green-400/10',
  stopped: 'text-gray-400 border-gray-400/20 bg-gray-400/10',
  pending: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
  error: 'text-red-400 border-red-400/20 bg-red-400/10'
}

const statusIcons = {
  running: CheckCircle,
  stopped: XCircle,
  pending: Clock,
  error: AlertCircle
}

function WorkspacePage() {
  const router = useRouter()
  const { id } = router.query
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('terminal')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Welcome to ClaudeOSaar Workspace Terminal',
    'Type "help" for available commands',
    '$ '
  ])

  useEffect(() => {
    if (id) {
      fetchWorkspace()
    }
  }, [id])

  const fetchWorkspace = async () => {
    try {
      // Mock workspace data for development
      if (id) {
        const mockWorkspace: Workspace = {
          id: id as string,
          name: `Workspace ${id}`,
          description: 'Development workspace',
          userId: '1',
          tier: 'pro',
          status: 'running',
          dockerId: `container-${id}`,
          resources: {
            cpu: 2,
            memory: 2048,
            storage: 50,
            bandwidth: 1000
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setWorkspace(mockWorkspace)
      }
    } catch (error) {
      console.error('Failed to fetch workspace:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    try {
      // Mock action handling for development
      if (workspace) {
        const updatedWorkspace = { ...workspace }
        
        switch (action) {
          case 'start':
            updatedWorkspace.status = 'running'
            break
          case 'stop':
            updatedWorkspace.status = 'stopped'
            break
          case 'restart':
            updatedWorkspace.status = 'pending'
            setTimeout(() => {
              setWorkspace({ ...updatedWorkspace, status: 'running' })
            }, 2000)
            break
        }
        
        setWorkspace(updatedWorkspace)
      }
    } catch (error) {
      console.error(`Failed to ${action} workspace:`, error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Loading Workspace...
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Workspace Not Found</h2>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const StatusIcon = statusIcons[workspace.status]

  return (
    <>
      <Head>
        <title>{workspace.name} - ClaudeOSaar Workspace</title>
        <meta name="description" content={`${workspace.name} workspace - ${workspace.description || 'AI development environment'}`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Terminal className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ClaudeOSaar
              </span>
            </Link>
            <ChevronRight className="w-5 h-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-white">{workspace.name}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusColors[workspace.status]}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">{workspace.status}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {workspace.status === 'running' ? (
                <>
                  <button
                    onClick={() => handleAction('stop')}
                    className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    Stop
                  </button>
                  <button
                    onClick={() => handleAction('restart')}
                    className="px-4 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    Restart
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAction('start')}
                  className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: 0 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          className="w-64 border-r border-white/10 bg-gray-900/50 backdrop-blur-xl"
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'terminal', icon: Terminal, label: 'Terminal' },
                { id: 'code', icon: Code2, label: 'Code Editor' },
                { id: 'database', icon: Database, label: 'Database' },
                { id: 'metrics', icon: BarChart3, label: 'Metrics' },
                { id: 'logs', icon: Activity, label: 'Logs' },
                { id: 'git', icon: GitBranch, label: 'Git' },
                { id: 'packages', icon: Package, label: 'Packages' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resource Usage */}
          <div className="p-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Resource Usage</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> CPU
                  </span>
                  <span className="text-xs text-gray-400">
                    {workspace.metrics?.cpuUsage || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-blue-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${workspace.metrics?.cpuUsage || 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> Memory
                  </span>
                  <span className="text-xs text-gray-400">
                    {workspace.metrics?.memoryUsage || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-purple-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${workspace.metrics?.memoryUsage || 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Database className="w-3 h-3" /> Storage
                  </span>
                  <span className="text-xs text-gray-400">
                    {workspace.metrics?.storageUsage || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-pink-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${workspace.metrics?.storageUsage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'terminal' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Terminal</h2>
                <div className="flex items-center gap-2">
                  <button className="p-3 hover:bg-white/10 rounded-lg transition-colors" aria-label="New terminal">
                    <Plus className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-3 hover:bg-white/10 rounded-lg transition-colors" aria-label="Download logs">
                    <Download className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-3 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close terminal">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-4 font-mono text-sm text-green-400 bg-black/50 overflow-auto">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="whitespace-pre">{line}</div>
                ))}
                <div className="flex items-center">
                  <span>$ </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none ml-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value
                        setTerminalOutput([...terminalOutput, `$ ${value}`])
                        e.currentTarget.value = ''
                        // Simulate command response
                        setTimeout(() => {
                          // Mock command responses
                          let response = ''
                          
                          switch (value.toLowerCase()) {
                            case 'help':
                              response = `Available commands:
  ls       - List files
  cd       - Change directory
  pwd      - Print working directory
  clear    - Clear terminal
  status   - Show workspace status
  metrics  - Show resource metrics`
                              break
                            case 'ls':
                              response = 'index.js  package.json  src/  node_modules/'
                              break
                            case 'pwd':
                              response = '/workspace'
                              break
                            case 'clear':
                              setTerminalOutput(['Welcome to ClaudeOSaar Workspace Terminal', 'Type "help" for available commands', '$ '])
                              return
                            case 'status':
                              response = `Workspace: ${workspace?.name}
Status: ${workspace?.status}
Tier: ${workspace?.tier}
CPU: ${workspace?.resources.cpu} cores
Memory: ${workspace?.resources.memory} MB`
                              break
                            case 'metrics':
                              response = `CPU Usage: 45%
Memory Usage: 862MB / ${workspace?.resources.memory}MB
Storage: 12GB / ${workspace?.resources.storage}GB
Network: 256KB/s`
                              break
                            default:
                              response = `Command '${value}' executed successfully`
                          }
                          
                          setTerminalOutput(prev => [...prev, response])
                        }, 300)
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Workspace Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Cpu className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold text-white">
                      {workspace.metrics?.cpuUsage || 0}%
                    </span>
                  </div>
                  <h3 className="text-gray-400 font-medium">CPU Usage</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {workspace.resources.cpu} vCPU allocated
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <HardDrive className="w-8 h-8 text-purple-400" />
                    <span className="text-2xl font-bold text-white">
                      {workspace.metrics?.memoryUsage || 0}%
                    </span>
                  </div>
                  <h3 className="text-gray-400 font-medium">Memory Usage</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {workspace.resources.memory}GB allocated
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Database className="w-8 h-8 text-pink-400" />
                    <span className="text-2xl font-bold text-white">
                      {workspace.metrics?.storageUsage || 0}%
                    </span>
                  </div>
                  <h3 className="text-gray-400 font-medium">Storage Usage</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {workspace.resources.storage}GB allocated
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/50 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Globe className="w-8 h-8 text-green-400" />
                    <span className="text-2xl font-bold text-white">
                      {((workspace.metrics?.networkIO?.in || 0) + (workspace.metrics?.networkIO?.out || 0)) / 1024 / 1024}MB
                    </span>
                  </div>
                  <h3 className="text-gray-400 font-medium">Network I/O</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Total transferred
                  </p>
                </motion.div>
              </div>

              {/* Placeholder for graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">CPU Usage Over Time</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart coming soon...
                  </div>
                </div>
                
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Memory Usage Over Time</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart coming soon...
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Workspace Settings</h2>
              
              <div className="space-y-6 max-w-3xl">
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Workspace Name
                      </label>
                      <input
                        type="text"
                        defaultValue={workspace.name}
                        className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        defaultValue={workspace.description}
                        className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Resource Allocation</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <span className="text-gray-400">Subscription Tier</span>
                      <span className="text-white font-medium capitalize">{workspace.tier}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <span className="text-gray-400">CPU</span>
                      <span className="text-white font-medium">{workspace.resources.cpu} vCPU</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <span className="text-gray-400">Memory</span>
                      <span className="text-white font-medium">{workspace.resources.memory}GB</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <span className="text-gray-400">Storage</span>
                      <span className="text-white font-medium">{workspace.resources.storage}GB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-white font-medium">Enable AppArmor Security</span>
                        <p className="text-sm text-gray-400 mt-1">
                          Enhanced container security with AppArmor profiles
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded text-blue-400 focus:ring-blue-400"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-white font-medium">Network Isolation</span>
                        <p className="text-sm text-gray-400 mt-1">
                          Isolate workspace network from other workspaces
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded text-blue-400 focus:ring-blue-400"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                    Save Changes
                  </button>
                  <button className="px-6 py-3 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors">
                    Delete Workspace
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  )
}

export default withAuth(WorkspacePage)