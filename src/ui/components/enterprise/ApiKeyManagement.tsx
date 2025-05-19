import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Copy, Check, RefreshCw, Shield, X } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  lastUsed: string;
  created: string;
  expires: string;
  permissions: string[];
  status: 'active' | 'revoked' | 'expired';
  usageCount: number;
  rateLimit: {
    requests: number;
    period: string;
  };
}

interface ApiKeyManagementProps {
  organizationId: string;
}

export function ApiKeyManagement({ organizationId }: ApiKeyManagementProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchApiKeys();
  }, [organizationId]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/api-keys`);
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyKey = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeys(prev => new Set(prev).add(keyId));
      setTimeout(() => {
        setCopiedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy key:', error);
    }
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await fetch(`/api/organizations/${organizationId}/api-keys/${keyId}/revoke`, {
        method: 'POST'
      });
      await fetchApiKeys();
    } catch (error) {
      console.error('Failed to revoke key:', error);
    }
  };

  const regenerateKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to regenerate this API key? Existing integrations will stop working.')) {
      return;
    }

    try {
      await fetch(`/api/organizations/${organizationId}/api-keys/${keyId}/regenerate`, {
        method: 'POST'
      });
      await fetchApiKeys();
    } catch (error) {
      console.error('Failed to regenerate key:', error);
    }
  };

  const filteredKeys = apiKeys.filter(key => {
    if (filters.status !== 'all' && key.status !== filters.status) {
      return false;
    }
    if (filters.search && !key.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
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
        <h2 className="text-2xl font-bold text-gray-900">API Key Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                   transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Key
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredKeys.map((key) => (
          <div
            key={key.id}
            className="bg-white p-6 rounded-lg border border-gray-200 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{key.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      key.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : key.status === 'revoked'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {key.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Created: {new Date(key.created).toLocaleDateString()}</span>
                  <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                  <span>Usage: {key.usageCount.toLocaleString()} requests</span>
                </div>

                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {key.prefix}...{revealedKeys.has(key.id) ? key.key.slice(-8) : '********'}
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title={revealedKeys.has(key.id) ? 'Hide key' : 'Show key'}
                  >
                    {revealedKeys.has(key.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => copyKey(key.key, key.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy key"
                  >
                    {copiedKeys.has(key.id) ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {key.status === 'active' && (
                  <>
                    <button
                      onClick={() => regenerateKey(key.id)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 
                               rounded transition-colors"
                      title="Regenerate key"
                    >
                      <RefreshCw size={18} />
                    </button>
                    <button
                      onClick={() => revokeKey(key.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 
                               rounded transition-colors"
                      title="Revoke key"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {key.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Rate Limits</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} />
                    <span>
                      {key.rateLimit.requests} requests per {key.rateLimit.period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredKeys.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No API keys found matching your criteria.
        </div>
      )}

      {showCreateModal && (
        <CreateApiKeyModal
          organizationId={organizationId}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchApiKeys();
          }}
        />
      )}
    </div>
  );
}

// Create API Key Modal Component
function CreateApiKeyModal({ 
  organizationId, 
  onClose, 
  onCreated 
}: { 
  organizationId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[],
    expiresIn: '30',
    rateLimit: {
      requests: 1000,
      period: 'hour'
    }
  });

  const availablePermissions = [
    'workspace.read',
    'workspace.write',
    'workspace.delete',
    'billing.read',
    'billing.write',
    'team.read',
    'team.write',
    'settings.read',
    'settings.write'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await fetch(`/api/organizations/${organizationId}/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      onCreated();
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New API Key</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Production API Key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availablePermissions.map((permission) => (
                <label
                  key={permission}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires In
              </label>
              <select
                value={formData.expiresIn}
                onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate Limit
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.rateLimit.requests}
                  onChange={(e) => setFormData({
                    ...formData,
                    rateLimit: { ...formData.rateLimit, requests: parseInt(e.target.value) }
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.rateLimit.period}
                  onChange={(e) => setFormData({
                    ...formData,
                    rateLimit: { ...formData.rateLimit, period: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minute">per minute</option>
                  <option value="hour">per hour</option>
                  <option value="day">per day</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                       hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
            >
              Create API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}