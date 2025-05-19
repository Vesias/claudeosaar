import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface Tier {
  id: string;
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function Billing() {
  const [currentTier, setCurrentTier] = useState('free');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const tiers: Tier[] = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      features: [
        '1 Workspace',
        '512MB RAM, 0.5 vCPU',
        '5GB Storage',
        'Community support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€13.99',
      features: [
        'Unlimited Workspaces',
        '2GB RAM, 2 vCPU',
        '50GB Storage',
        'Priority support',
        'Claude Max integration',
        'Advanced memory bank'
      ],
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '€21.99',
      features: [
        'Unlimited Workspaces',
        '8GB RAM, 4 vCPU',
        '100GB Storage',
        'SSO authentication',
        'Dedicated support',
        'Custom integrations',
        'Multi-agent support'
      ]
    }
  ];

  const handleSubscribe = async (tier: string) => {
    if (tier === 'free') return;

    setLoading(true);
    try {
      const response = await axios.post('/api/billing/create-subscription', {
        tier
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const stripe = await stripePromise;
      const { error } = await stripe!.confirmCardPayment(response.data.client_secret);

      if (!error) {
        setCurrentTier(tier);
        alert('Subscription successful!');
      } else {
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Billing & Subscription</h1>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="ghost"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-400">Scale your AI development with ClaudeOSaar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-gray-800 rounded-lg p-8 border ${
                tier.highlighted ? 'border-blue-500' : 'border-gray-700'
              } ${currentTier === tier.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tier.highlighted && (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                  MOST POPULAR
                </div>
              )}
              
              <h2 className="text-2xl font-bold mb-4">{tier.name}</h2>
              <p className="text-3xl font-bold mb-6">
                {tier.price}
                {tier.id !== 'free' && <span className="text-lg font-normal">/month</span>}
              </p>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(tier.id)}
                disabled={loading || currentTier === tier.id}
                variant={tier.highlighted ? 'primary' : 'secondary'}
                className="w-full"
              >
                {currentTier === tier.id 
                  ? 'Current Plan' 
                  : tier.id === 'free' 
                  ? 'Downgrade' 
                  : 'Subscribe'}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>All plans include automatic backups, SSL certificates, and 99.9% uptime SLA</p>
          <p className="mt-2">Questions? Contact us at support@claudeosaar.saarland</p>
        </div>
      </main>
    </div>
  );
}