import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { withAuth } from '../../components/withAuth';
import {
  ArrowLeft,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Info,
  Check,
  AlertCircle,
  Rocket
} from 'lucide-react';

interface WorkspaceConfig {
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  region: string;
  description: string;
}

const tiers = {
  free: {
    name: 'Free',
    resources: {
      cpu: '0.5 cores',
      memory: '512MB RAM',
      storage: '5GB',
    },
    features: [
      'Basic MCP tools',
      'Community support',
      'Single workspace',
    ],
    price: '€0',
  },
  pro: {
    name: 'Pro',
    resources: {
      cpu: '2 cores',
      memory: '2GB RAM',
      storage: '50GB',
    },
    features: [
      'Advanced MCP tools',
      'Priority support',
      'Up to 5 workspaces',
      'Custom integrations',
    ],
    price: '€13.99/mo',
  },
  enterprise: {
    name: 'Enterprise',
    resources: {
      cpu: '4 cores',
      memory: '8GB RAM',
      storage: '100GB',
    },
    features: [
      'Multi-agent support',
      '24/7 dedicated support',
      'Unlimited workspaces',
      'SSO integration',
      'Custom deployment',
    ],
    price: '€21.99/mo',
  },
};

function NewWorkspace() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState<WorkspaceConfig>({
    name: '',
    tier: 'free',
    region: 'eu-central-1',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For development, simulate workspace creation
      const mockResponse = {
        workspace: {
          id: Date.now().toString(),
          name: config.name,
          status: 'pending',
        }
      };

      // Navigate to the new workspace
      router.push(`/workspace/${mockResponse.workspace.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const validateName = (name: string) => {
    return /^[a-z0-9-]+$/.test(name) && name.length >= 3 && name.length <= 30;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Link
              href="/workspace"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Workspace</h1>
              <p className="text-sm text-gray-500">Configure your AI development environment</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Workspace Name */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workspace Details</h2>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Name
            </label>
            <input
              id="name"
              type="text"
              required
              pattern="[a-z0-9-]+"
              minLength={3}
              maxLength={30}
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value.toLowerCase() })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="my-workspace"
            />
            <div className="mt-2 flex items-start gap-2">
              <Info className="h-4 w-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-500">
                Use lowercase letters, numbers, and hyphens only. 3-30 characters.
              </p>
            </div>
            {config.name && !validateName(config.name) && (
              <p className="mt-2 text-sm text-red-600">
                Invalid name format. Use only lowercase letters, numbers, and hyphens.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A workspace for my AI development project..."
            />
          </div>
        </div>

        {/* Resource Tier */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(tiers).map(([key, tier]) => (
              <div
                key={key}
                onClick={() => setConfig({ ...config, tier: key as any })}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                  config.tier === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{tier.price}</p>
                  </div>
                  {config.tier === key && (
                    <Check className="h-6 w-6 text-blue-600" />
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{tier.resources.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{tier.resources.memory}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{tier.resources.storage}</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Region</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setConfig({ ...config, region: 'eu-central-1' })}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                config.region === 'eu-central-1'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe className="h-6 w-6 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">EU Central (Frankfurt)</h4>
                <p className="text-sm text-gray-500">Best for European users</p>
              </div>
              {config.region === 'eu-central-1' && (
                <Check className="h-5 w-5 text-blue-600 ml-auto" />
              )}
            </div>

            <div
              onClick={() => setConfig({ ...config, region: 'us-east-1' })}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                config.region === 'us-east-1'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe className="h-6 w-6 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">US East (Virginia)</h4>
                <p className="text-sm text-gray-500">Best for American users</p>
              </div>
              {config.region === 'us-east-1' && (
                <Check className="h-5 w-5 text-blue-600 ml-auto" />
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Workspace Name:</span>
              <span className="font-medium text-gray-900">{config.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resource Tier:</span>
              <span className="font-medium text-gray-900">{tiers[config.tier].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Region:</span>
              <span className="font-medium text-gray-900">
                {config.region === 'eu-central-1' ? 'EU Central (Frankfurt)' : 'US East (Virginia)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Cost:</span>
              <span className="font-bold text-gray-900">{tiers[config.tier].price}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !config.name || !validateName(config.name)}
            className={`flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
                     hover:bg-blue-700 transition-colors flex items-center justify-center gap-2
                     ${(loading || !config.name || !validateName(config.name)) 
                       ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>Loading...</>
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                Create Workspace
              </>
            )}
          </button>
          
          <Link
            href="/workspace"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold
                     hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default withAuth(NewWorkspace);