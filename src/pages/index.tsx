import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import SaarlandMap from '../components/SaarlandMap';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import TerminalDemo from '../components/TerminalDemo';
import PricingCard from '../components/PricingCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Database, 
  Users, 
  Shield, 
  Cloud,
  Boxes,
  Globe,
  ArrowRight,
  Building2,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Boxes className="h-8 w-8" />,
      title: "Containerized Workspaces",
      description: "Isolated Docker environments with integrated Claude CLI for secure AI development.",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "MCP Integration",
      description: "Model Context Protocol for enhanced AI capabilities and seamless tool integration.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Memory Bank",
      description: "Persistent context storage and retrieval system for continuous AI workflows.",
      gradient: "from-green-600 to-teal-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-tenant Architecture",
      description: "Enterprise-grade user isolation with resource limits based on subscription tier.",
      gradient: "from-orange-600 to-red-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security First",
      description: "AppArmor profiles, JWT authentication, and container isolation for maximum security.",
      gradient: "from-indigo-600 to-blue-600"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Native",
      description: "Kubernetes-ready deployment with auto-scaling and global load balancing.",
      gradient: "from-cyan-600 to-blue-600"
    }
  ];

  const tiers = [
    {
      name: "Free",
      price: "€0",
      description: "Perfect for getting started",
      features: [
        "1 workspace",
        "512MB RAM per workspace",
        "5GB storage",
        "Basic MCP tools",
        "Community support",
        "Standard response time"
      ],
      cta: "Start Free",
      popular: false,
      gradient: "from-gray-600 to-gray-800"
    },
    {
      name: "Pro",
      price: "€13.99",
      description: "For professional developers",
      features: [
        "Up to 5 workspaces",
        "2GB RAM per workspace",
        "50GB storage",
        "Advanced MCP tools",
        "Priority support",
        "Custom integrations",
        "Faster response times",
        "API access"
      ],
      cta: "Start Pro Trial",
      popular: true,
      gradient: "from-blue-600 to-indigo-700"
    },
    {
      name: "Enterprise",
      price: "€21.99",
      description: "For teams and organizations",
      features: [
        "Unlimited workspaces",
        "8GB RAM per workspace",
        "100GB storage",
        "Multi-agent support",
        "24/7 dedicated support",
        "Custom deployment",
        "SSO integration",
        "SLA guarantee",
        "Advanced analytics"
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-purple-600 to-pink-700"
    }
  ];

  const testimonials = [
    {
      quote: "ClaudeOSaar has revolutionized our AI development workflow. The containerized workspaces are a game-changer.",
      author: "Sarah Chen",
      role: "CTO, TechCorp",
      avatar: "SC"
    },
    {
      quote: "The MCP integration makes working with Claude incredibly seamless. It's like having an AI pair programmer.",
      author: "Michael Rodriguez",
      role: "Lead Developer, StartupXYZ",
      avatar: "MR"
    },
    {
      quote: "Enterprise security features gave us the confidence to move our AI workloads to ClaudeOSaar.",
      author: "Emma Thompson",
      role: "Security Director, FinanceInc",
      avatar: "ET"
    }
  ];


  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25 animate-pulse"></div>
                <Globe className="relative h-8 w-8 text-primary-500" />
              </div>
              <div>
                <span className="text-xl font-bold font-display">ClaudeOSaar</span>
                <span className="text-xs text-neutral-400 block -mt-1">agentland.saarland</span>
              </div>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-neutral-300 hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="text-neutral-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/docs" className="text-neutral-300 hover:text-white transition-colors">Documentation</Link>
              <Link href="/blog" className="text-neutral-300 hover:text-white transition-colors">Blog</Link>
              {isAuthenticated ? (
                <>
                  <Link href="/workspace" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                  <div className="flex items-center gap-3">
                    <Badge variant="primary" className="h-8 w-8 p-0 rounded-full flex items-center justify-center">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">Login</Link>
                  <Button variant="primary" onClick={() => router.push('/signup')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
            <div className="px-4 py-4 space-y-3">
              <Link href="/features" className="block text-gray-300 hover:text-white">Features</Link>
              <Link href="/pricing" className="block text-gray-300 hover:text-white">Pricing</Link>
              <Link href="/docs" className="block text-gray-300 hover:text-white">Documentation</Link>
              <Link href="/blog" className="block text-gray-300 hover:text-white">Blog</Link>
              {isAuthenticated ? (
                <Link href="/workspace" className="block text-gray-300 hover:text-white">Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="block text-gray-300 hover:text-white">Login</Link>
                  <Link href="/signup" className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Terminal Demo */}
      <TerminalDemo />

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Everything you need for professional AI development in one powerful platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-neutral-400">
              Start free, upgrade when you need more power
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <PricingCard key={index} {...tier} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-neutral-400">
              See what our users are saying about ClaudeOSaar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="glass" hover="scale" className="h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <Badge variant="primary" className="w-12 h-12 p-0 rounded-full flex items-center justify-center text-lg font-semibold">
                      {testimonial.avatar}
                    </Badge>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-neutral-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-neutral-300 italic">"{testimonial.quote}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Saarland Map Section */}
      <SaarlandMap />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your AI Development?
          </h2>
          <p className="text-xl text-neutral-400 mb-8">
            Join thousands of developers building the future with ClaudeOSaar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push(isAuthenticated ? '/workspace' : '/signup')}
              rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              className="group"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
            </Button>
            <Button
              size="lg"
              variant="glass"
              onClick={() => router.push('/contact')}
              leftIcon={<Building2 className="h-5 w-5" />}
            >
              Enterprise Solutions
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-primary-500" />
                <span className="text-lg font-bold font-display">ClaudeOSaar</span>
              </div>
              <p className="text-neutral-400 text-sm">
                AI Development Workspace OS
              </p>
              <p className="text-neutral-500 text-xs mt-1">
                agentland.saarland
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-neutral-300">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/partners" className="hover:text-white transition-colors">Partners</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link></li>
                <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              &copy; 2025 ClaudeOSaar. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="/twitter" className="text-neutral-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="/github" className="text-neutral-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/linkedin" className="text-neutral-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}