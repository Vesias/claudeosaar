import React, { useState, useEffect } from 'react';
import {
  Brain,
  Code,
  Command,
  Database,
  FileCode,
  FileSearch,
  GitBranch,
  Globe,
  Key,
  Package,
  Play,
  Settings,
  Terminal,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface McpTool {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'file' | 'system' | 'integration' | 'custom';
  status: 'active' | 'inactive' | 'error';
  usage: number;
  lastUsed: string;
  icon: React.ReactNode;
}

interface McpStats {
  totalExecutions: number;
  successRate: number;
  averageResponseTime: number;
  activeTools: number;
}

export function McpDashboard() {
  const [tools, setTools] = useState<McpTool[]>([]);
  const [stats, setStats] = useState<McpStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for development
    const mockTools: McpTool[] = [
      {
        id: 'execute-command',
        name: 'Execute Command',
        description: 'Run shell commands in the workspace',
        category: 'core',
        status: 'active',
        usage: 1542,
        lastUsed: '2 minutes ago',
        icon: <Terminal className="h-5 w-5" />
      },
      {
        id: 'read-file',
        name: 'Read File',
        description: 'Read contents of files in the workspace',
        category: 'file',
        status: 'active',
        usage: 892,
        lastUsed: '5 minutes ago',
        icon: <FileCode className="h-5 w-5" />
      },
      {
        id: 'write-file',
        name: 'Write File',
        description: 'Create or modify files in the workspace',
        category: 'file',
        status: 'active',
        usage: 673,
        lastUsed: '10 minutes ago',
        icon: <FileCode className="h-5 w-5" />
      },
      {
        id: 'search-memory',
        name: 'Search Memory Bank',
        description: 'Search through stored context and memory',
        category: 'core',
        status: 'active',
        usage: 431,
        lastUsed: '1 hour ago',
        icon: <Database className="h-5 w-5" />
      },
      {
        id: 'git-operations',
        name: 'Git Operations',
        description: 'Execute git commands',
        category: 'integration',
        status: 'active',
        usage: 234,
        lastUsed: '3 hours ago',
        icon: <GitBranch className="h-5 w-5" />
      },
      {
        id: 'package-manager',
        name: 'Package Manager',
        description: 'Manage npm/pip/cargo packages',
        category: 'system',
        status: 'inactive',
        usage: 156,
        lastUsed: '1 day ago',
        icon: <Package className="h-5 w-5" />
      },
      {
        id: 'code-analysis',
        name: 'Code Analysis',
        description: 'Analyze code quality and patterns',
        category: 'custom',
        status: 'active',
        usage: 89,
        lastUsed: '6 hours ago',
        icon: <Code className="h-5 w-5" />
      },
      {
        id: 'web-search',
        name: 'Web Search',
        description: 'Search the web for information',
        category: 'integration',
        status: 'error',
        usage: 12,
        lastUsed: '2 days ago',
        icon: <Globe className="h-5 w-5" />
      }
    ];

    const mockStats: McpStats = {
      totalExecutions: 3789,
      successRate: 97.2,
      averageResponseTime: 245,
      activeTools: 6
    };

    setTools(mockTools);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'All Tools', icon: <Zap /> },
    { id: 'core', name: 'Core', icon: <Brain /> },
    { id: 'file', name: 'File System', icon: <FileSearch /> },
    { id: 'system', name: 'System', icon: <Command /> },
    { id: 'integration', name: 'Integrations', icon: <Globe /> },
    { id: 'custom', name: 'Custom', icon: <Code /> }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getStatusIcon = (status: McpTool['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalExecutions.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Play className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.successRate}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.averageResponseTime}ms
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tools</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeTools}/{tools.length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Settings className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 pb-4 border-b border-gray-200 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
              ${selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {tool.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{tool.category}</p>
                </div>
              </div>
              {getStatusIcon(tool.status)}
            </div>

            <p className="text-sm text-gray-600 mb-4">{tool.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Usage</span>
                <span className="font-medium text-gray-900">
                  {tool.usage.toLocaleString()} calls
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last used</span>
                <span className="text-gray-700">{tool.lastUsed}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 
                           transition-colors text-sm font-medium"
                >
                  Configure
                </button>
                <button
                  className={`flex-1 px-3 py-2 rounded transition-colors text-sm font-medium
                    ${tool.status === 'active'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  {tool.status === 'active' ? 'Test' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">MCP Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">API Key</h3>
              <p className="text-sm text-gray-500">Your MCP server API key</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Regenerate
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Tool Permissions</h3>
              <p className="text-sm text-gray-500">Manage tool access and permissions</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Rate Limits</h3>
              <p className="text-sm text-gray-500">Configure API rate limits</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}