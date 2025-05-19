import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Users, 
  Server, 
  Activity, 
  DollarSign,
  Shield,
  Settings,
  Building2,
  ChevronRight
} from 'lucide-react';
import { MetricsCard } from '../../components/enterprise/MetricsCard';
import { TeamManagement } from '../../components/enterprise/TeamManagement';
import { ResourceMonitor } from '../../components/enterprise/ResourceMonitor';
import { SecurityOverview } from '../../components/enterprise/SecurityOverview';
import { CostAnalytics } from '../../components/enterprise/CostAnalytics';
import { AdminSidebar } from '../../components/enterprise/AdminSidebar';
import { ApiKeyManagement } from '../../components/enterprise/ApiKeyManagement';
import { ActivityLogs } from '../../components/enterprise/ActivityLogs';
import { IntegrationManagement } from '../../components/enterprise/IntegrationManagement';
import axios from 'axios';

interface EnterpriseMetrics {
  totalUsers: number;
  activeWorkspaces: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  monthlySpend: number;
  securityAlerts: number;
  apiCalls: number;
}

export default function EnterpriseDashboard() {
  const [metrics, setMetrics] = useState<EnterpriseMetrics | null>(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkEnterpriseAccess();
    fetchMetrics();
  }, []);

  const checkEnterpriseAccess = async () => {
    try {
      const response = await axios.get('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.subscription_tier !== 'enterprise') {
        router.push('/dashboard');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/enterprise/metrics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to fetch enterprise metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'team':
        return <TeamManagement />;
      case 'resources':
        return <ResourceMonitor />;
      case 'security':
        return <SecurityOverview />;
      case 'costs':
        return <CostAnalytics />;
      case 'api-keys':
        return <ApiKeyManagement organizationId="enterprise" />;
      case 'activity-logs':
        return <ActivityLogs organizationId="enterprise" />;
      case 'integrations':
        return <IntegrationManagement organizationId="enterprise" />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    if (!metrics) return null;

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total Users"
            value={metrics.totalUsers}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
            color="blue"
          />
          <MetricsCard
            title="Active Workspaces"
            value={metrics.activeWorkspaces}
            icon={<Server className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
            color="green"
          />
          <MetricsCard
            title="Monthly Spend"
            value={`€${metrics.monthlySpend.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 5, isPositive: false }}
            color="purple"
          />
          <MetricsCard
            title="Security Alerts"
            value={metrics.securityAlerts}
            icon={<Shield className="h-6 w-6" />}
            trend={{ value: 25, isPositive: false }}
            color="red"
          />
        </div>

        {/* Resource Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Resource Utilization</h3>
            <div className="space-y-4">
              <ResourceBar
                label="CPU Usage"
                value={metrics.cpuUsage}
                max={100}
                unit="%"
                color="blue"
              />
              <ResourceBar
                label="Memory Usage"
                value={metrics.memoryUsage}
                max={100}
                unit="%"
                color="green"
              />
              <ResourceBar
                label="Storage Usage"
                value={metrics.storageUsage}
                max={100}
                unit="%"
                color="purple"
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">API Usage (Last 7 Days)</h3>
            <UsageChart data={generateUsageData()} />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ActivityFeed />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <AdminSidebar 
        selectedView={selectedView}
        onViewChange={setSelectedView}
      />
      
      <div className="flex-1">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold">Enterprise Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/enterprise/settings')}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">A</span>
                  </div>
                  <span className="text-sm">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}

// Sub-components
function ResourceBar({ label, value, max, unit, color }) {
  const percentage = (value / max) * 100;
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-medium">{value}{unit}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function UsageChart({ data }) {
  // Simplified chart component - in production, use a proper charting library
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="h-48 flex items-end gap-2">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${height}%` }}
            />
            <span className="text-xs text-gray-400 mt-2">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { id: 1, user: 'john@company.com', action: 'Created new workspace', time: '2 minutes ago', type: 'create' },
    { id: 2, user: 'admin@company.com', action: 'Updated security settings', time: '15 minutes ago', type: 'security' },
    { id: 3, user: 'jane@company.com', action: 'Deployed to production', time: '1 hour ago', type: 'deploy' },
    { id: 4, user: 'system', action: 'Automated backup completed', time: '3 hours ago', type: 'system' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <Server className="h-4 w-4 text-green-500" />;
      case 'security': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'deploy': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <ChevronRight className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
          {getActivityIcon(activity.type)}
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>
              {' '}
              <span className="text-gray-400">{activity.action}</span>
            </p>
          </div>
          <span className="text-xs text-gray-500">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}

function generateUsageData() {
  return [
    { label: 'Mon', value: 1250 },
    { label: 'Tue', value: 1890 },
    { label: 'Wed', value: 1560 },
    { label: 'Thu', value: 2150 },
    { label: 'Fri', value: 2890 },
    { label: 'Sat', value: 890 },
    { label: 'Sun', value: 650 },
  ];
}