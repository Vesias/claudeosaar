import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
  Server, 
  Brain, 
  Database, 
  Users, 
  Shield, 
  Zap,
  ChevronRight,
  Code,
  Terminal,
  Cloud,
  Boxes,
  Globe,
  ArrowRight,
  Star,
  Check,
  Sparkles,
  Lock,
  Gauge,
  GitBranch,
  BarChart3,
  Building2,
  Award,
  FileCode,
  Layers,
  Cpu,
  Play,
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

  const stats = [
    { value: "10k+", label: "Active Developers" },
    { value: "1M+", label: "AI Queries Processed" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "24/7", label: "Enterprise Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                <Globe className="relative h-8 w-8 text-blue-500" />
              </div>
              <div>
                <span className="text-xl font-bold">ClaudeOSaar</span>
                <span className="text-xs text-gray-400 block -mt-1">agentland.saarland</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">Documentation</Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              {isAuthenticated ? (
                <>
                  <Link href="/workspace" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                  <Link 
                    href="/signup" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
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
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 backdrop-blur-sm px-4 py-2 rounded-full text-blue-300 text-sm mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Now available on agentland.saarland</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Development Workspace OS
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The sovereign AI development platform that combines containerized workspaces 
            with native Claude CLI integration for unprecedented productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => router.push(isAuthenticated ? '/workspace' : '/signup')}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Start Free Trial'}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/demo')}
              className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-gray-700"
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Demo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience the Power of Claude CLI
            </h2>
            <p className="text-xl text-gray-400">
              AI-powered development right in your terminal
            </p>
          </div>

          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400">workspace-1 — claude@claudeosaar</span>
              </div>
              <div className="p-6">
                <pre className="text-green-400 font-mono text-sm leading-relaxed">
<span className="text-gray-500">$</span> claude --help
<span className="text-cyan-400">Claude CLI v2.3.0</span> - AI Assistant in your terminal

<span className="text-yellow-400">Usage:</span>
  claude [command] [flags]

<span className="text-yellow-400">Commands:</span>
  <span className="text-green-400">chat</span>     Start an interactive chat session
  <span className="text-green-400">run</span>      Execute a command with AI assistance
  <span className="text-green-400">search</span>   Search memory bank for context
  
<span className="text-gray-500">$</span> claude run "create a Python FastAPI server with user authentication"
<span className="text-blue-400">✓</span> Created <span className="text-yellow-400">main.py</span> with FastAPI application
<span className="text-blue-400">✓</span> Added JWT authentication middleware
<span className="text-blue-400">✓</span> Created user models and database schema
<span className="text-blue-400">✓</span> Generated requirements.txt
<span className="text-green-400">✓</span> Server ready at <span className="text-cyan-400">http://localhost:8000</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need for professional AI development in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl hover:bg-gray-800/70 transition-all duration-300 border border-gray-700 hover:border-gray-600"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                <div className={`relative p-3 bg-gradient-to-br ${feature.gradient} rounded-lg inline-block mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border ${
                  tier.popular 
                    ? 'border-blue-500 scale-105 shadow-2xl' 
                    : 'border-gray-700'
                } hover:border-gray-600 transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-gray-400 mb-4">{tier.description}</p>
                  <div className="text-4xl font-bold mb-1">
                    {tier.price}
                    {tier.price !== "€0" && <span className="text-base font-normal text-gray-400">/month</span>}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => router.push(tier.name === 'Enterprise' ? '/contact' : '/signup')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-gray-400">
              See what our users are saying about ClaudeOSaar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your AI Development?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of developers building the future with ClaudeOSaar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(isAuthenticated ? '/workspace' : '/signup')}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-gray-700"
            >
              <Building2 className="h-5 w-5" />
              Enterprise Solutions
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold">ClaudeOSaar</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI Development Workspace OS
              </p>
              <p className="text-gray-500 text-xs mt-1">
                agentland.saarland
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Product</h4>
              <ul className="space-y-2 text-gray-400">
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
          
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 ClaudeOSaar. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="/twitter" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="/github" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/linkedin" className="text-gray-400 hover:text-white transition-colors">
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