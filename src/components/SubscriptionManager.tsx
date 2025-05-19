import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Check,
  X,
  ChevronRight,
  Download,
  Calendar,
  TrendingUp,
  UserPlus,
  Shield,
  Zap,
  Star,
  AlertCircle,
  Settings,
  Clock
} from 'lucide-react';

interface Subscription {
  id: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
  paymentMethod?: {
    type: 'card';
    last4: string;
    brand: string;
  };
  usage: {
    workspaces: number;
    maxWorkspaces: number;
    storage: number;
    maxStorage: number;
    apiCalls: number;
    maxApiCalls: number;
  };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}

const plans = {
  free: {
    name: 'Free',
    price: 0,
    billing: 'Forever free',
    features: [
      '1 workspace',
      '512MB RAM per workspace',
      '5GB storage',
      'Basic MCP tools',
      'Community support',
      'Standard response time'
    ],
    limits: {
      workspaces: 1,
      storage: 5,
      apiCalls: 1000
    }
  },
  pro: {
    name: 'Pro',
    price: 13.99,
    billing: 'per month',
    features: [
      'Up to 5 workspaces',
      '2GB RAM per workspace',
      '50GB storage',
      'Advanced MCP tools',
      'Priority support',
      'Custom integrations',
      'Faster response times',
      'API access'
    ],
    limits: {
      workspaces: 5,
      storage: 50,
      apiCalls: 10000
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 21.99,
    billing: 'per month',
    features: [
      'Unlimited workspaces',
      '8GB RAM per workspace',
      '100GB storage',
      'Multi-agent support',
      '24/7 dedicated support',
      'Custom deployment options',
      'SSO integration',
      'SLA guarantee',
      'API priority access',
      'Advanced analytics'
    ],
    limits: {
      workspaces: -1, // unlimited
      storage: 100,
      apiCalls: -1 // unlimited
    }
  }
};

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise' | null>(null);

  useEffect(() => {
    // Mock data for development
    const mockSubscription: Subscription = {
      id: 'sub_1',
      tier: 'pro',
      status: 'active',
      currentPeriodStart: '2025-01-01T00:00:00Z',
      currentPeriodEnd: '2025-02-01T00:00:00Z',
      cancelAtPeriodEnd: false,
      trialEndsAt: undefined,
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'Visa'
      },
      usage: {
        workspaces: 3,
        maxWorkspaces: 5,
        storage: 12.5,
        maxStorage: 50,
        apiCalls: 4250,
        maxApiCalls: 10000
      }
    };

    const mockInvoices: Invoice[] = [
      {
        id: 'inv_1',
        date: '2025-01-01T00:00:00Z',
        amount: 13.99,
        status: 'paid',
        invoiceUrl: '#'
      },
      {
        id: 'inv_2',
        date: '2024-12-01T00:00:00Z',
        amount: 13.99,
        status: 'paid',
        invoiceUrl: '#'
      },
      {
        id: 'inv_3',
        date: '2024-11-01T00:00:00Z',
        amount: 13.99,
        status: 'paid',
        invoiceUrl: '#'
      }
    ];

    setSubscription(mockSubscription);
    setInvoices(mockInvoices);
    setLoading(false);
  }, []);

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return (current / max) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleUpgrade = (tier: 'pro' | 'enterprise') => {
    setSelectedPlan(tier);
    setShowUpgradeModal(true);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentPlan = subscription ? plans[subscription.tier] : plans.free;

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentPlan.name} Plan
            </h2>
            <p className="text-gray-600">
              {subscription?.status === 'trial' ? (
                <span className="text-yellow-600">
                  Trial ends on {formatDate(subscription.trialEndsAt!)}
                </span>
              ) : subscription?.status === 'active' ? (
                <span className="text-green-600">Active subscription</span>
              ) : (
                <span className="text-red-600">
                  {subscription?.status === 'cancelled' ? 'Cancelled' : 'Expired'}
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              €{currentPlan.price}
            </p>
            <p className="text-sm text-gray-500">{currentPlan.billing}</p>
          </div>
        </div>

        {subscription && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Workspaces</span>
                <span className="text-sm font-medium text-gray-900">
                  {subscription.usage.workspaces} / {
                    subscription.usage.maxWorkspaces === -1 
                      ? '∞' 
                      : subscription.usage.maxWorkspaces
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercentage(
                      subscription.usage.workspaces,
                      subscription.usage.maxWorkspaces
                    )}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-medium text-gray-900">
                  {subscription.usage.storage}GB / {subscription.usage.maxStorage}GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercentage(
                      subscription.usage.storage,
                      subscription.usage.maxStorage
                    )}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">API Calls</span>
                <span className="text-sm font-medium text-gray-900">
                  {subscription.usage.apiCalls.toLocaleString()} / {
                    subscription.usage.maxApiCalls === -1 
                      ? '∞' 
                      : subscription.usage.maxApiCalls.toLocaleString()
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercentage(
                      subscription.usage.apiCalls,
                      subscription.usage.maxApiCalls
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {subscription?.tier !== 'enterprise' && (
            <button
              onClick={() => handleUpgrade(subscription?.tier === 'free' ? 'pro' : 'enterprise')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                       transition-colors flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Upgrade Plan
            </button>
          )}
          {subscription?.tier !== 'free' && subscription?.status === 'active' && (
            <>
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 
                         transition-colors"
              >
                Cancel Subscription
              </button>
              <button
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 
                         transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Update Payment Method
              </button>
            </>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Compare Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([key, plan]) => {
            const isCurrentPlan = subscription?.tier === key;
            const isUpgrade = 
              (subscription?.tier === 'free' && key !== 'free') ||
              (subscription?.tier === 'pro' && key === 'enterprise');

            return (
              <div
                key={key}
                className={`border-2 rounded-lg p-6 relative ${
                  isCurrentPlan
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-gray-900">
                    €{plan.price}
                    <span className="text-sm font-normal text-gray-500">
                      {plan.billing}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isUpgrade && (
                  <button
                    onClick={() => handleUpgrade(key as 'pro' | 'enterprise')}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 
                             transition-colors"
                  >
                    Upgrade to {plan.name}
                  </button>
                )}
                {isCurrentPlan && (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                )}
                {!isUpgrade && !isCurrentPlan && (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Billing History</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Download All Invoices
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    €{invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={invoice.invoiceUrl}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium 
                               flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelSubscriptionModal
          subscription={subscription!}
          onClose={() => setShowCancelModal(false)}
          onConfirm={() => {
            // Handle cancellation
            setShowCancelModal(false);
          }}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <UpgradeModal
          currentTier={subscription!.tier}
          newTier={selectedPlan}
          onClose={() => setShowUpgradeModal(false)}
          onConfirm={() => {
            // Handle upgrade
            setShowUpgradeModal(false);
          }}
        />
      )}
    </div>
  );
}

// Cancel Subscription Modal
function CancelSubscriptionModal({ 
  subscription, 
  onClose, 
  onConfirm 
}: { 
  subscription: Subscription;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [reason, setReason] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Cancel Subscription</h3>
            <p className="text-sm text-gray-600">
              Your subscription will remain active until {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why are you cancelling? (optional)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Let us know how we can improve..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">You'll lose access to:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Multiple workspaces</li>
              <li>• Advanced MCP tools</li>
              <li>• Priority support</li>
              <li>• Custom integrations</li>
            </ul>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={confirmCancel}
              onChange={(e) => setConfirmCancel(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I understand my subscription will be cancelled
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={!confirmCancel}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors
              ${confirmCancel
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Cancel Subscription
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg 
                     hover:bg-gray-200 transition-colors font-medium"
          >
            Keep Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

// Upgrade Modal
function UpgradeModal({ 
  currentTier, 
  newTier, 
  onClose, 
  onConfirm 
}: { 
  currentTier: string;
  newTier: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const currentPlan = plans[currentTier as keyof typeof plans];
  const newPlan = plans[newTier as keyof typeof plans];
  const priceDiff = newPlan.price - currentPlan.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Upgrade to {newPlan.name}</h3>
            <p className="text-sm text-gray-600">
              +€{priceDiff.toFixed(2)}/month
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {newPlan.features.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p>Your new price will be <strong>€{newPlan.price}/month</strong></p>
          <p>You'll be charged the prorated amount for this billing period.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors font-medium"
          >
            Confirm Upgrade
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg 
                     hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}