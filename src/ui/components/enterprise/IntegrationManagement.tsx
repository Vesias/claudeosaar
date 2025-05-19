import React, { useState, useEffect } from 'react';
import { Link2, Link2Off, Settings, RefreshCw, CheckCircle, AlertCircle, Clock, Plus, ChevronRight, X } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  provider: 'github' | 'gitlab' | 'bitbucket' | 'slack' | 'jira' | 'notion' | 'discord' | 'stripe';
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string;
  config: {
    webhookUrl?: string;
    apiKey?: string;
    secretKey?: string;
    scope?: string[];
  };
  usage: {
    requests: number;
    errors: number;
    lastActivity: string;
  };
  features: string[];
}

interface IntegrationManagementProps {
  organizationId: string;
}

const providerLogos = {
  github: '🐙',
  gitlab: '🦊',
  bitbucket: '🔷',
  slack: '💬',
  jira: '📋',
  notion: '📝',
  discord: '🎮',
  stripe: '💳'
};

export function IntegrationManagement({ organizationId }: IntegrationManagementProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = {
    'all': 'All Integrations',
    'development': 'Development',
    'communication': 'Communication',
    'project': 'Project Management',
    'payment': 'Payment Processing'
  };

  const integrationCategories = {
    github: 'development',
    gitlab: 'development',
    bitbucket: 'development',
    slack: 'communication',
    discord: 'communication',
    jira: 'project',
    notion: 'project',
    stripe: 'payment'
  };

  useEffect(() => {
    fetchIntegrations();
  }, [organizationId]);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/integrations`);
      const data = await response.json();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (integrationId: string, enabled: boolean) => {
    try {
      await fetch(`/api/organizations/${organizationId}/integrations/${integrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      });
      await fetchIntegrations();
    } catch (error) {
      console.error('Failed to toggle integration:', error);
    }
  };

  const syncIntegration = async (integrationId: string) => {
    try {
      await fetch(`/api/organizations/${organizationId}/integrations/${integrationId}/sync`, {
        method: 'POST'
      });
      await fetchIntegrations();
    } catch (error) {
      console.error('Failed to sync integration:', error);
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    if (categoryFilter === 'all') return true;
    return integrationCategories[integration.provider] === categoryFilter;
  });

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
        <h2 className="text-2xl font-bold text-gray-900">Integration Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                   transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Integration
        </button>
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${categoryFilter === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg 
                     transition-shadow cursor-pointer"
            onClick={() => setSelectedIntegration(integration)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{providerLogos[integration.provider]}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-500">{integration.provider}</p>
                </div>
              </div>
              <StatusIndicator status={integration.status} />
            </div>

            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last sync:</span>
                <span className="text-gray-700">
                  {new Date(integration.lastSync).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">API calls:</span>
                <span className="text-gray-700">
                  {integration.usage.requests.toLocaleString()}
                </span>
              </div>
              {integration.usage.errors > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-500">Errors:</span>
                  <span className="text-red-700">{integration.usage.errors}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {integration.status === 'connected' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    syncIntegration(integration.id);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded 
                           hover:bg-gray-200 transition-colors flex items-center 
                           justify-center gap-2 text-sm"
                >
                  <RefreshCw size={16} />
                  Sync Now
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIntegration(integration);
                }}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded 
                         hover:bg-blue-200 transition-colors flex items-center 
                         justify-center gap-2 text-sm"
              >
                <Settings size={16} />
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No integrations found in this category.
        </div>
      )}

      {/* Integration Details Modal */}
      {selectedIntegration && (
        <IntegrationDetailsModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onUpdate={fetchIntegrations}
          organizationId={organizationId}
        />
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <AddIntegrationModal
          organizationId={organizationId}
          onClose={() => setShowAddModal(false)}
          onAdd={fetchIntegrations}
        />
      )}
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({ status }: { status: Integration['status'] }) {
  const statusConfigs = {
    connected: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    disconnected: {
      icon: Link2Off,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  };

  const config = statusConfigs[status];
  const Icon = config.icon;

  return (
    <div className={`p-2 rounded-full ${config.bgColor}`}>
      <Icon size={16} className={config.color} />
    </div>
  );
}

// Integration Details Modal
function IntegrationDetailsModal({ 
  integration, 
  onClose, 
  onUpdate,
  organizationId
}: { 
  integration: Integration;
  onClose: () => void;
  onUpdate: () => void;
  organizationId: string;
}) {
  const [config, setConfig] = useState(integration.config);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSave = async () => {
    try {
      await fetch(`/api/organizations/${organizationId}/integrations/${integration.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config })
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update integration:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{providerLogos[integration.provider]}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{integration.name}</h3>
              <p className="text-sm text-gray-500">{integration.provider}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('configuration')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'configuration'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'webhooks'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'logs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Logs
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                <div className="flex items-center gap-3">
                  <StatusIndicator status={integration.status} />
                  <span className="text-gray-900 capitalize">{integration.status}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900">{integration.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {integration.usage.requests.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Error Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {((integration.usage.errors / integration.usage.requests) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="space-y-6">
              {config.apiKey !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {config.secretKey !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    value={config.secretKey}
                    onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {config.scope !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scope / Permissions
                  </label>
                  <div className="space-y-2">
                    {['read', 'write', 'admin'].map((scopeItem) => (
                      <label key={scopeItem} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={config.scope?.includes(scopeItem)}
                          onChange={(e) => {
                            const newScope = e.target.checked
                              ? [...(config.scope || []), scopeItem]
                              : config.scope?.filter(s => s !== scopeItem) || [];
                            setConfig({ ...config, scope: newScope });
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{scopeItem}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                           hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Webhook URL</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={config.webhookUrl || 'Not configured'}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                  />
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                             hover:bg-gray-200 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Webhook Events</h4>
                <div className="space-y-2">
                  {['repository.push', 'issue.created', 'pr.merged', 'build.completed'].map(
                    (event) => (
                      <label key={event} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{event}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Recent webhook events and API calls will be displayed here.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                No recent logs available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add Integration Modal
function AddIntegrationModal({ 
  organizationId, 
  onClose, 
  onAdd 
}: { 
  organizationId: string;
  onClose: () => void;
  onAdd: () => void;
}) {
  const availableProviders = [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect to GitHub for repository access and CI/CD',
      category: 'development'
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Integrate with GitLab for source control and pipelines',
      category: 'development'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to Slack channels',
      category: 'communication'
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Sync with Jira for project management',
      category: 'project'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Process payments and manage subscriptions',
      category: 'payment'
    }
  ];

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!selectedProvider) return;

    try {
      await fetch(`/api/organizations/${organizationId}/integrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider: selectedProvider })
      });
      onAdd();
      onClose();
    } catch (error) {
      console.error('Failed to add integration:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Integration</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {availableProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedProvider === provider.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{providerLogos[provider.id as keyof typeof providerLogos]}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                     hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedProvider}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            Add Integration
          </button>
        </div>
      </div>
    </div>
  );
}