import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import SaarlandMap from '../components/SaarlandMap';
import { motion } from 'framer-motion';
import { 
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '../components/ui';
import { 
  Shield, 
  Container, 
  Globe,
  Server,
  Database,
  Network,
  Brain,
  Code,
  Key,
  Cpu,
  HardDrive,
  Users,
  ArrowRight
} from 'lucide-react';

export default function AgentlandPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const featureBenefits = [
    {
      icon: <Container className="h-8 w-8" />,
      feature: "Docker-based containerization",
      benefit: "Instant, reproducible development environments",
      description: "Launch isolated development environments with a single click, ensuring consistency across your team and eliminating 'works on my machine' problems."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      feature: "AppArmor security profiles",
      benefit: "Enterprise-grade security and compliance",
      description: "Every container is hardened with AppArmor security profiles to prevent unauthorized access and ensure compliance with security standards."
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      feature: "Per-workspace resource limits",
      benefit: "Predictable performance without unexpected costs",
      description: "Resources are allocated based on your subscription tier, ensuring predictable performance and costs even at scale."
    },
    {
      icon: <Server className="h-8 w-8" />,
      feature: "MCP Server integration",
      benefit: "Extend Claude's capabilities beyond standard APIs",
      description: "The Model Context Protocol allows Claude to interact with your development environment, execute commands, and understand your codebase."
    },
    {
      icon: <Database className="h-8 w-8" />,
      feature: "Memory Bank",
      benefit: "Never lose context between development sessions",
      description: "Our persistent context storage system allows Claude to retain information across sessions, making every interaction more productive."
    },
    {
      icon: <Network className="h-8 w-8" />,
      feature: "A2A Protocol",
      benefit: "Build cooperative multi-agent systems that work together",
      description: "For Enterprise users, enable agent-to-agent communication that lets multiple AI assistants collaborate on complex tasks."
    },
    {
      icon: <Key className="h-8 w-8" />,
      feature: "JWT & HTTP-only cookies",
      benefit: "Modern, secure authentication without headaches",
      description: "Industry-standard authentication mechanisms protect your account and workspaces with minimal friction."
    },
    {
      icon: <HardDrive className="h-8 w-8" />,
      feature: "Persistent volume mounting",
      benefit: "Seamless data persistence between sessions",
      description: "Your files and data are securely stored and available whenever you access your workspace, with no manual backup required."
    },
    {
      icon: <Users className="h-8 w-8" />,
      feature: "Multi-tenant architecture",
      benefit: "Scale your team without compromising isolation",
      description: "Add team members and scale your projects while maintaining complete isolation between users and workspaces."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      feature: "Custom agent templates",
      benefit: "Accelerate development with proven patterns",
      description: "Start with optimized agent templates for common use cases, saving hours of configuration and prompt engineering."
    },
    {
      icon: <Code className="h-8 w-8" />,
      feature: "Prompt enhancement system",
      benefit: "Optimize Claude interactions for better results",
      description: "Our built-in prompt enhancement system automatically optimizes your interactions with Claude to produce more accurate and useful responses."
    }
  ];

  const tiers = [
    {
      name: "Developer Sandbox",
      price: "Free",
      description: "Experience ClaudeOSaar's isolated workspace architecture with our Developer Sandbox. Perfect for experimentation and learning.",
      features: [
        "512MB RAM, 0.5 CPU cores",
        "5GB storage",
        "1 workspace",
        "Basic MCP tools",
        "Community support",
        "Standard response time"
      ],
      gradient: "from-gray-600 to-gray-800",
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Agent Production Studio",
      price: "€13.99/mo",
      description: "Scale your AI projects with our Agent Production Studio. Perfect balance of power and value for serious development.",
      features: [
        "2GB RAM, 2 CPU cores",
        "50GB storage (10× Free tier)",
        "Up to 5 workspaces",
        "Enhanced MCP capabilities",
        "Priority support",
        "API access",
        "Custom integrations"
      ],
      gradient: "from-blue-600 to-indigo-700",
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Multi-Agent Command Center",
      price: "€21.99/mo",
      description: "Orchestrate complex AI ecosystems with our Multi-Agent Command Center. The sovereign workspace for serious AI developers.",
      features: [
        "8GB RAM, 4 CPU cores",
        "100GB storage",
        "Unlimited workspaces",
        "A2A Protocol for multi-agent support",
        "Dedicated networking",
        "24/7 priority support",
        "Custom deployment options",
        "SSO integration"
      ],
      gradient: "from-purple-600 to-pink-700",
      cta: "Upgrade to Enterprise",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navigation - simplified version */}
      <nav className="bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25"></div>
                <Globe className="relative h-8 w-8 text-primary-500" />
              </div>
              <div>
                <span className="text-xl font-bold font-display">agentland.saarland</span>
                <span className="text-xs text-neutral-400 block -mt-1">by ClaudeOSaar</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
              ) : (
                <>
                  <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">Login</Link>
                  <Button onClick={() => router.push('/signup')}>Get Started</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="primary" className="mb-8 px-4 py-2 text-sm font-medium">
            Saarland's Sovereign Workspace for AI Agent Developers
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-accent-500">
            Where Claude Meets Containers
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-10">
            The secure, isolated development environment built specifically for AI agent creation and deployment in Saarland.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/signup')}>
              Get Started Free
            </Button>
            <Button size="lg" variant="glass" onClick={() => router.push('/demo')}>
              View Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for AI Developers, By AI Developers
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              ClaudeOSaar addresses the unique challenges of AI agent development with a platform designed for security, isolation, and productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">Jobs to be Done</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Build and deploy AI agents securely</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Develop with Claude's capabilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                    <Container className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Manage development environments efficiently</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-orange-500/20 text-orange-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Scale resources based on project needs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">Pains Relieved</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-500/20 text-red-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Security and isolation concerns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-500/20 text-red-400">
                    <Container className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Development environment setup complexity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-500/20 text-red-400">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Limited integration with Claude</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-500/20 text-red-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Context management challenges</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">Gains Created</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Streamlined AI agent development</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Enhanced productivity with Claude integration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Security confidence in isolated environments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-neutral-200">Persistent context via Memory Bank</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature-Benefit Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Technical Features, Human Benefits
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              See how ClaudeOSaar's advanced technology translates to real-world value for AI developers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featureBenefits.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-neutral-900 border-neutral-800 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 text-primary-500">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-accent-400 mb-1">{item.feature}</h3>
                        <p className="text-xl font-bold text-white mb-2">{item.benefit}</p>
                        <p className="text-neutral-400">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Workspace
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Find the perfect balance of resources and features for your AI development needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.popular ? 'md:-mt-8 md:mb-8' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                    <Badge variant="primary" className="mx-auto px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <Card className={`h-full flex flex-col ${tier.popular ? 'border-primary-600 bg-neutral-900' : 'bg-neutral-900 border-neutral-800'}`}>
                  <CardHeader className="pb-0">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  </CardHeader>
                  <CardContent className="py-6 flex-grow">
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-white">{tier.price}</p>
                      {tier.price !== "Free" && <p className="text-neutral-400 text-sm">per month</p>}
                    </div>
                    <p className="text-neutral-300 mb-6">{tier.description}</p>
                    <ul className="space-y-3">
                      {tier.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-neutral-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className={`w-full ${tier.popular ? 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700' : ''}`}
                      variant={tier.popular ? 'default' : 'outline'}
                      onClick={() => router.push('/signup')}
                    >
                      {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Common questions about agentland.saarland
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                How is agentland.saarland different from other development environments?
              </AccordionTrigger>
              <AccordionContent>
                Unlike generic development environments, agentland.saarland is specifically designed for AI agent development with Claude integration. Our containerized workspaces provide security isolation, while our Memory Bank and MCP Server offer AI-native features not found in standard environments.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">
                What technologies does ClaudeOSaar use for containerization?
              </AccordionTrigger>
              <AccordionContent>
                We use Docker for containerization with AppArmor security profiles for enhanced isolation. Each container has resource limits based on subscription tier and persistent volume mounting at "/user_mounts/USER_ID/WORKSPACE_ID". Our multi-tenant architecture ensures complete isolation between users.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">
                How does the Memory Bank work?
              </AccordionTrigger>
              <AccordionContent>
                The Memory Bank is our persistent context storage system. It uses vector embeddings (1536 dimensions) to store and retrieve development progress, documentation, and project context. This allows Claude to maintain context across sessions and provide more consistent assistance over time.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">
                What is the connection to Saarland, Germany?
              </AccordionTrigger>
              <AccordionContent>
                ClaudeOSaar is headquartered in Saarland, Germany, which has emerged as a hub for AI development in Europe. Our platform serves all six districts of Saarland, providing local developers with sovereign AI infrastructure while welcoming users from around the world.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">
                Can I use my own Anthropic API key?
              </AccordionTrigger>
              <AccordionContent>
                Yes! While we provide managed Claude access, you can also use your own Anthropic API key for complete control. This is particularly useful for enterprise customers with existing Anthropic contracts or those with specific API rate requirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Saarland Map Section */}
      <SaarlandMap />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Agentland Saarland Community
          </h2>
          <p className="text-xl text-neutral-400 mb-8">
            Experience the future of AI development with our containerized Claude workspaces
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="group"
            >
              Get Started Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="glass"
              onClick={() => router.push('/contact')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-primary-500" />
                <span className="text-lg font-bold font-display">agentland.saarland</span>
              </div>
              <p className="text-neutral-400 text-sm">
                by ClaudeOSaar — Saarland's Sovereign Workspace for AI Agent Developers
              </p>
              <p className="text-neutral-500 text-xs mt-1">
                &copy; 2025 ClaudeOSaar. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}