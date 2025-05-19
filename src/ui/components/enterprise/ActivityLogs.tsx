import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, User, Activity, AlertCircle, Shield, Settings, X } from 'lucide-react';

interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  metadata: Record<string, any>;
  duration: number;
  category: 'auth' | 'workspace' | 'billing' | 'team' | 'api' | 'security';
  severity: 'info' | 'warning' | 'error' | 'critical';
}

interface ActivityLogsProps {
  organizationId: string;
}

const categoryIcons = {
  auth: User,
  workspace: Activity,
  billing: Settings,
  team: User,
  api: Shield,
  security: AlertCircle
};

const categoryColors = {
  auth: 'text-blue-600 bg-blue-100',
  workspace: 'text-green-600 bg-green-100',
  billing: 'text-purple-600 bg-purple-100',
  team: 'text-yellow-600 bg-yellow-100',
  api: 'text-pink-600 bg-pink-100',
  security: 'text-red-600 bg-red-100'
};

export function ActivityLogs({ organizationId }: ActivityLogsProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    dateRange: '7d',
    userId: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  useEffect(() => {
    fetchLogs();
  }, [organizationId, filters, pagination.page]);

  const fetchLogs = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      const response = await fetch(
        `/api/organizations/${organizationId}/activity-logs?${queryParams}`
      );
      const data = await response.json();
      
      setLogs(data.logs);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/activity-logs/export`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(filters)
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
        <button
          onClick={exportLogs}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 
                   hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    size={20} />
            <input
              type="text"
              placeholder="Search by action, resource, user..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg 
                     hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Filter size={20} />
            Filters
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg 
                     hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="workspace">Workspace</option>
              <option value="billing">Billing</option>
              <option value="team">Team</option>
              <option value="api">API</option>
              <option value="security">Security</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="warning">Warning</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>

            <input
              type="text"
              placeholder="Filter by user ID..."
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => {
                const Icon = categoryIcons[log.category];
                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {log.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${log.status === 'success' 
                            ? 'bg-green-100 text-green-800'
                            : log.status === 'failure'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(log.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div
                        className={`inline-flex p-2 rounded-lg ${categoryColors[log.category]}`}
                        title={log.category}
                      >
                        <Icon size={16} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No activity logs found matching your criteria.
          </div>
        )}

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <LogDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}

// Log Details Modal Component
function LogDetailsModal({ log, onClose }: { log: ActivityLog; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Activity Log Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'metadata'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Metadata
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'request'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Request Info
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Log ID</h4>
                <p className="text-sm text-gray-900">{log.id}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Timestamp</h4>
                <p className="text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">User</h4>
                <p className="text-sm text-gray-900">
                  {log.userName} ({log.userEmail})
                </p>
                <p className="text-xs text-gray-500 mt-1">ID: {log.userId}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Action</h4>
                <p className="text-sm text-gray-900">{log.action}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Resource</h4>
                <p className="text-sm text-gray-900">
                  {log.resource} (ID: {log.resourceId})
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${log.status === 'success' 
                      ? 'bg-green-100 text-green-800'
                      : log.status === 'failure'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {log.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Category</h4>
                <p className="text-sm text-gray-900 capitalize">{log.category}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Severity</h4>
                <p className="text-sm text-gray-900 capitalize">{log.severity}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Duration</h4>
                <p className="text-sm text-gray-900">{log.duration}ms</p>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'request' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">IP Address</h4>
                <p className="text-sm text-gray-900">{log.ipAddress}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">User Agent</h4>
                <p className="text-sm text-gray-900 break-all">{log.userAgent}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}