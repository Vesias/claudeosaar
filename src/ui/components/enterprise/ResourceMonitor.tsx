import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Network, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ResourceChart } from './charts/ResourceChart';
import axios from 'axios';

interface ResourceData {
  workspaceId: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu: number;
  memory: number;
  storage: number;
  network: {
    in: number;
    out: number;
  };
  tier: string;
  owner: string;
  uptime: string;
}

interface SystemMetrics {
  totalCpu: number;
  totalMemory: number;
  totalStorage: number;
  availableCpu: number;
  availableMemory: number;
  availableStorage: number;
}

export function ResourceMonitor() {
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('1h');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchResources();
    const interval = autoRefresh ? setInterval(fetchResources, 5000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchResources = async () => {
    try {
      const [resourcesRes, metricsRes] = await Promise.all([
        axios.get('/api/enterprise/resources', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/enterprise/system-metrics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setResources(resourcesRes.data);
      setSystemMetrics(metricsRes.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'stopped':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Resource Monitor</h2>
          <p className="text-gray-400 mt-1">Monitor system resources and workspace utilization</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* System Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-3 gap-6">
          <SystemMetricCard
            title="CPU Usage"
            used={systemMetrics.totalCpu - systemMetrics.availableCpu}
            total={systemMetrics.totalCpu}
            unit="vCPU"
            icon={<Cpu className="h-5 w-5" />}
            color="blue"
          />
          <SystemMetricCard
            title="Memory Usage"
            used={systemMetrics.totalMemory - systemMetrics.availableMemory}
            total={systemMetrics.totalMemory}
            unit="GB"
            icon={<Server className="h-5 w-5" />}
            color="green"
          />
          <SystemMetricCard
            title="Storage Usage"
            used={systemMetrics.totalStorage - systemMetrics.availableStorage}
            total={systemMetrics.totalStorage}
            unit="GB"
            icon={<HardDrive className="h-5 w-5" />}
            color="purple"
          />
        </div>
      )}

      {/* Resource Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Active Workspaces</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.workspaceId}
                resource={resource}
                isSelected={selectedResource === resource.workspaceId}
                onSelect={() => setSelectedResource(resource.workspaceId)}
              />
            ))}
          </div>
        </div>

        {/* Resource Details */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Resource Details</h3>
          {selectedResource ? (
            <ResourceDetails 
              resource={resources.find(r => r.workspaceId === selectedResource)!}
              timeRange={timeRange}
            />
          ) : (
            <div className="text-center text-gray-400 py-12">
              <Server className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select a workspace to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Resource Allocation Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resource Allocation by Tier</h3>
        <ResourceChart 
          data={generateAllocationData(resources)}
          type="allocation"
        />
      </div>
    </div>
  );
}

function SystemMetricCard({ title, used, total, unit, icon, color }) {
  const percentage = (used / total) * 100;
  const getColorClasses = () => {
    const baseColors = {
      blue: { bg: 'bg-blue-900/20', border: 'border-blue-700', bar: 'bg-blue-500' },
      green: { bg: 'bg-green-900/20', border: 'border-green-700', bar: 'bg-green-500' },
      purple: { bg: 'bg-purple-900/20', border: 'border-purple-700', bar: 'bg-purple-500' }
    };
    return baseColors[color] || baseColors.blue;
  };

  const colors = getColorClasses();

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm text-gray-400">{title}</h4>
          <p className="text-2xl font-bold mt-1">
            {used.toFixed(1)} / {total} {unit}
          </p>
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${colors.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">{percentage.toFixed(1)}% utilized</p>
    </div>
  );
}

function ResourceCard({ resource, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-900/20 border-blue-700'
          : 'bg-gray-700/50 border-gray-700 hover:bg-gray-700'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon(resource.status)}
          <div>
            <h4 className="font-medium">{resource.name}</h4>
            <p className="text-sm text-gray-400">{resource.owner}</p>
          </div>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded">{resource.tier}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-400">CPU</p>
          <p className="font-medium">{resource.cpu}%</p>
        </div>
        <div>
          <p className="text-gray-400">Memory</p>
          <p className="font-medium">{resource.memory}%</p>
        </div>
        <div>
          <p className="text-gray-400">Network</p>
          <p className="font-medium">{resource.network.in + resource.network.out} MB/s</p>
        </div>
      </div>
    </div>
  );
}

function ResourceDetails({ resource, timeRange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Workspace ID</p>
          <p className="font-mono text-sm">{resource.workspaceId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Uptime</p>
          <p className="font-medium">{resource.uptime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Tier</p>
          <p className="font-medium capitalize">{resource.tier}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Owner</p>
          <p className="font-medium">{resource.owner}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">CPU Usage</span>
            <span className="text-sm font-medium">{resource.cpu}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${resource.cpu}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Memory Usage</span>
            <span className="text-sm font-medium">{resource.memory}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${resource.memory}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Storage Usage</span>
            <span className="text-sm font-medium">{resource.storage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-purple-500"
              style={{ width: `${resource.storage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-lg p-4">
        <h5 className="font-medium mb-3">Network I/O</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Inbound</p>
            <p className="text-lg font-medium">{resource.network.in} MB/s</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Outbound</p>
            <p className="text-lg font-medium">{resource.network.out} MB/s</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="sm" className="flex-1">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
        <Button variant="secondary" size="sm" className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          View Logs
        </Button>
      </div>
    </div>
  );
}

function generateAllocationData(resources: ResourceData[]) {
  const tierData = resources.reduce((acc, resource) => {
    if (!acc[resource.tier]) {
      acc[resource.tier] = { cpu: 0, memory: 0, storage: 0, count: 0 };
    }
    acc[resource.tier].cpu += resource.cpu;
    acc[resource.tier].memory += resource.memory;
    acc[resource.tier].storage += resource.storage;
    acc[resource.tier].count += 1;
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(tierData).map(([tier, data]) => ({
    tier,
    cpu: data.cpu / data.count,
    memory: data.memory / data.count,
    storage: data.storage / data.count,
    count: data.count
  }));
}