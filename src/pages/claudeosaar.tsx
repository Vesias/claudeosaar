import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Button,
  Badge,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../components/ui';
import { 
  Globe,
  Terminal,
  Server,
  Database,
  Brain,
  Code,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ErrorBoundary } from '../ui/error/ErrorBoundary';
import { lazyLoad } from '../components/LazyLoad';

// Dynamically import the TerminalDemo to improve page load performance with fadeIn effect
const TerminalDemo = lazyLoad(
  () => import('../components/TerminalDemo'),
  <div className="flex justify-center items-center py-32">
    <div className="animate-pulse flex flex-col items-center">
      <div className="rounded-md bg-neutral-200 dark:bg-neutral-800 h-8 w-24 mb-4"></div>
      <div className="h-32 w-full max-w-3xl bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
    </div>
  </div>,
  200 // 200ms delay for animation
);

export default function ClaudeOSaarLanding() {
  const router = useRouter();

  // Ecosystem partners
  const partners = [
    {
      name: "agentland.saarland",
      description: "The secure, isolated development environment for AI agent creation in Saarland.",
      icon: <Brain className="h-8 w-8 text-accent-500" />,
      link: "/agentland",
      gradient: "from-primary-600 to-accent-600"
    },
    {
      name: "terminal.claudeosaar.saarland",
      description: "Direct Claude CLI access for rapid prototyping and experimentation.",
      icon: <Terminal className="h-8 w-8 text-green-500" />,
      link: "/terminal",
      gradient: "from-green-600 to-teal-600"
    },
    {
      name: "docs.claudeosaar.saarland",
      description: "Comprehensive documentation, tutorials, and developer guides.",
      icon: <Code className="h-8 w-8 text-blue-500" />,
      link: "/docs",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      name: "mcp.claudeosaar.saarland",
      description: "Model Context Protocol server for enhanced AI capabilities.",
      icon: <Server className="h-8 w-8 text-purple-500" />,
      link: "/mcp",
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  // Platform overview
  const platformFeatures = [
    {
      title: "Workspace OS",
      description: "Our containerized workspace operating system provides the foundation for AI development with Claude integration.",
      icon: <Layers className="h-10 w-10" />,
      details: [
        "Docker containers with AppArmor security",
        "Tiered resource allocation based on subscription",
        "Persistent storage with automatic backup",
        "Browser-based workspace access"
      ]
    },
    {
      title: "Security Layer",
      description: "Enterprise-grade security built into every aspect of the platform ensures your data and code remain protected.",
      icon: <Lock className="h-10 w-10" />,
      details: [
        "Workspace isolation via AppArmor profiles",
        "JWT authentication with HTTP-only cookies",
        "Network segmentation between workspaces",
        "Regular security audits and updates"
      ]
    },
    {
      title: "AI Integration",
      description: "Native Claude integration brings AI capabilities directly into your development environment.",
      icon: <Brain className="h-10 w-10" />,
      details: [
        "Built-in Claude CLI access",
        "MCP Server for enhanced capabilities",
        "Memory Bank for persistent context",
        "A2A Protocol for multi-agent support"
      ]
    },
    {
      title: "Data Infrastructure",
      description: "Robust data management provides the backbone for AI development and context storage.",
      icon: <Database className="h-10 w-10" />,
      details: [
        "PostgreSQL + pgvector for embeddings",
        "Redis for caching",
        "Qdrant for vector search",
        "Persistent data across sessions"
      ]
    }
  ];

  // Timeline of platform evolution
  const timeline = [
    {
      year: 2023,
      title: "Prototype Development",
      description: "Initial concept and prototype of ClaudeOSaar developed in Saarbrücken, Germany."
    },
    {
      year: 2024,
      title: "Alpha Release",
      description: "First alpha release with containerized workspaces and basic Claude integration."
    },
    {
      year: 2025,
      title: "Public Launch",
      description: "Official launch with Memory Bank, MCP Server, and subscription tiers.",
      active: true
    },
    {
      year: "Next",
      title: "Future Roadmap",
      description: "A2A Protocol enhancements, custom agent deployment pipelines, and expanded infrastructure."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navigation */}
      <nav className="bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25"></div>
                <Globe className="relative h-8 w-8 text-primary-500" />
              </div>
              <div>
                <span className="text-xl font-bold font-display">ClaudeOSaar</span>
                <span className="text-xs text-neutral-400 block -mt-1">claudeosaar.saarland</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/ecosystem" className="text-neutral-300 hover:text-white transition-colors">Ecosystem</Link>
              <Link href="/platform" className="text-neutral-300 hover:text-white transition-colors">Platform</Link>
              <Link href="/docs" className="text-neutral-300 hover:text-white transition-colors">Documentation</Link>
              <Link href="/pricing" className="text-neutral-300 hover:text-white transition-colors">Pricing</Link>
              <Button onClick={() => router.push('/signup')}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/30 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent-600/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge variant="primary" className="mb-8 px-4 py-2 text-sm font-medium">
            The Sovereign AI Development Platform from Saarland
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-display">
            ClaudeOSaar
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-10">
            The comprehensive AI development ecosystem providing isolated workspace environments with native Claude integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
            >
              Start Developing
            </Button>
            <Button size="lg" variant="glass" onClick={() => router.push('/platform')}>
              Explore Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Terminal Demo Section */}
      <ErrorBoundary>
        <TerminalDemo />
      </ErrorBoundary>

      {/* Ecosystem Partners Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Digital Ecosystem
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              ClaudeOSaar extends across multiple specialized platforms to create a comprehensive AI development ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className={`animate-fadeIn animation-delay-${(index + 1) * 100}`}
                style={{ opacity: 0 }} // Initial state before animation starts
              >
                <Card 
                  className="h-full bg-neutral-900 border-neutral-800 overflow-hidden relative group"
                  hover="scale"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${partner.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-neutral-800 text-white">
                        {partner.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{partner.name}</h3>
                        <p className="text-neutral-300 mb-4">{partner.description}</p>
                        <Link 
                          href={partner.link}
                          className="text-primary-500 hover:text-primary-400 flex items-center gap-1 font-medium"
                        >
                          Visit platform <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Platform Architecture
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              A layered approach to AI development infrastructure designed for security, efficiency, and productivity.
            </p>
          </div>

          <Tabs defaultValue="workspace" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="workspace">Workspace OS</TabsTrigger>
              <TabsTrigger value="security">Security Layer</TabsTrigger>
              <TabsTrigger value="ai">AI Integration</TabsTrigger>
              <TabsTrigger value="data">Data Infrastructure</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workspace">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8">
                    <div className="p-8 rounded-full bg-gradient-to-br from-primary-600/20 to-accent-600/20 text-primary-500">
                      {platformFeatures[0].icon}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-2xl font-bold mb-3 text-white">{platformFeatures[0].title}</h3>
                  <p className="text-lg text-neutral-300 mb-6">{platformFeatures[0].description}</p>
                  <ul className="space-y-3">
                    {platformFeatures[0].details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-primary-500/20 text-primary-500 mt-0.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-200">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="outline" onClick={() => router.push('/platform')}>
                      Learn more about {platformFeatures[0].title}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8">
                    <div className="p-8 rounded-full bg-gradient-to-br from-primary-600/20 to-accent-600/20 text-primary-500">
                      {platformFeatures[1].icon}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-2xl font-bold mb-3 text-white">{platformFeatures[1].title}</h3>
                  <p className="text-lg text-neutral-300 mb-6">{platformFeatures[1].description}</p>
                  <ul className="space-y-3">
                    {platformFeatures[1].details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-primary-500/20 text-primary-500 mt-0.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-200">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="outline" onClick={() => router.push('/platform')}>
                      Learn more about {platformFeatures[1].title}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8">
                    <div className="p-8 rounded-full bg-gradient-to-br from-primary-600/20 to-accent-600/20 text-primary-500">
                      {platformFeatures[2].icon}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-2xl font-bold mb-3 text-white">{platformFeatures[2].title}</h3>
                  <p className="text-lg text-neutral-300 mb-6">{platformFeatures[2].description}</p>
                  <ul className="space-y-3">
                    {platformFeatures[2].details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-primary-500/20 text-primary-500 mt-0.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-200">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="outline" onClick={() => router.push('/platform')}>
                      Learn more about {platformFeatures[2].title}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8">
                    <div className="p-8 rounded-full bg-gradient-to-br from-primary-600/20 to-accent-600/20 text-primary-500">
                      {platformFeatures[3].icon}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-2xl font-bold mb-3 text-white">{platformFeatures[3].title}</h3>
                  <p className="text-lg text-neutral-300 mb-6">{platformFeatures[3].description}</p>
                  <ul className="space-y-3">
                    {platformFeatures[3].details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-primary-500/20 text-primary-500 mt-0.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-200">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="outline" onClick={() => router.push('/platform')}>
                      Learn more about {platformFeatures[3].title}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              The evolution of ClaudeOSaar from concept to leading AI development platform.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-20 md:left-1/2 w-0.5 bg-neutral-800 transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} animate-fadeIn animation-delay-${(index + 1) * 100}`}
                  style={{ opacity: 0 }} // Initial state before animation starts
                >
                  {/* Center dot */}
                  <div className="absolute left-20 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className={`w-5 h-5 rounded-full ${item.active ? 'bg-primary-500' : 'bg-neutral-700'}`}></div>
                  </div>
                  
                  {/* Content */}
                  <div className={`md:w-1/2 ml-28 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className={`p-5 bg-neutral-900 rounded-xl border ${item.active ? 'border-primary-600/50' : 'border-neutral-800'}`}>
                      <span className="block text-sm font-semibold text-neutral-400 mb-1">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-neutral-300 mt-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Saarland Connection Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="primary" className="mb-4">Founded in Saarland</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Saarland Roots
              </h2>
              <p className="text-lg text-neutral-300 mb-4">
                ClaudeOSaar was founded in Saarland, Germany, a growing hub for AI research and development in Europe. Our name combines Claude, the AI assistant, with "OSaar" - a nod to our operating system's Saarland origins.
              </p>
              <p className="text-lg text-neutral-300 mb-8">
                Today, we serve developers across all six districts of Saarland and beyond, bringing sovereign AI infrastructure to European developers while welcoming users from around the world.
              </p>
              <Button 
                onClick={() => router.push('/about')}
                variant="outline"
                className="group"
              >
                Learn more about our story <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
              <div className="p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Serving all of Saarland</h3>
                  <p className="text-neutral-400">Saarbrücken · Neunkirchen · Saarlouis · St. Wendel · Merzig-Wadern · Saarpfalz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-900/50 to-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="primary" className="mb-4">Get Started Today</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your AI Development?
          </h2>
          <p className="text-xl text-neutral-300 mb-8">
            Join our growing community of developers building the future with ClaudeOSaar's sovereign AI workspaces
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
            >
              Create Free Account
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

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-primary-500" />
                <span className="text-lg font-bold font-display">ClaudeOSaar</span>
              </div>
              <p className="text-neutral-400 max-w-sm">
                The sovereign AI development platform providing containerized workspaces with Claude integration.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/workspace" className="hover:text-white">Workspaces</Link></li>
                <li><Link href="/mcp" className="hover:text-white">MCP Server</Link></li>
                <li><Link href="/memory" className="hover:text-white">Memory Bank</Link></li>
                <li><Link href="/a2a" className="hover:text-white">A2A Protocol</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Ecosystem</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/agentland" className="hover:text-white">agentland.saarland</Link></li>
                <li><Link href="/terminal" className="hover:text-white">terminal.claudeosaar.saarland</Link></li>
                <li><Link href="/docs" className="hover:text-white">docs.claudeosaar.saarland</Link></li>
                <li><Link href="/mcp" className="hover:text-white">mcp.claudeosaar.saarland</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between">
            <p className="text-neutral-400 text-sm">
              &copy; 2025 ClaudeOSaar. All rights reserved.
            </p>
            <p className="text-neutral-500 text-sm mt-2 md:mt-0">
              Made with <span className="text-red-500">♥</span> in Saarland, Germany
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}