import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '../components/ui';
import { 
  Check,
  X,
  Globe,
  Brain,
  Server,
  Database,
  Shield,
  Users,
  Container,
  Layers,
  Clock,
  HardDrive,
  Network,
  Wrench
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  const tiers = [
    {
      name: "Free",
      productName: "Developer Sandbox",
      description: "Experience ClaudeOSaar's isolated workspace architecture with our Developer Sandbox.",
      pricingMonthly: "€0",
      pricingAnnual: "€0",
      mainFeatures: [
        { name: "1 workspace", available: true },
        { name: "512MB RAM, 0.5 CPU cores", available: true },
        { name: "5GB storage", available: true },
        { name: "Basic MCP tools", available: true },
        { name: "Community support", available: true },
        { name: "Standard response time", available: true },
      ],
      jobsToDo: [
        "Experiment with containerized AI workspaces",
        "Learn Claude integration patterns",
        "Test basic MCP functionality",
        "Prototype simple AI agents"
      ],
      pains: [
        "Limited computing resources",
        "Single workspace only",
        "Basic support options",
        "Limited Memory Bank capacity",
        "No A2A Protocol access"
      ],
      gains: [
        "No cost barrier to entry",
        "Full isolation and security features",
        "Basic Claude CLI access",
        "Community knowledge sharing",
        "Path to higher tiers as needs grow"
      ],
      CTAText: "Get Started Free",
      popular: false,
      gradient: "from-gray-700 to-neutral-900"
    },
    {
      name: "Pro",
      productName: "Agent Production Studio",
      description: "Scale your AI projects with our Agent Production Studio. Perfect balance of power and value.",
      pricingMonthly: "€13.99",
      pricingAnnual: "€139.90",
      discount: "16% off",
      mainFeatures: [
        { name: "Up to 5 workspaces", available: true },
        { name: "2GB RAM, 2 CPU cores", available: true },
        { name: "50GB storage", available: true },
        { name: "Enhanced MCP capabilities", available: true },
        { name: "Priority support", available: true },
        { name: "API access", available: true },
        { name: "Custom integrations", available: true },
        { name: "Advanced Memory Bank", available: true },
        { name: "Multi-agent workflows", available: false },
      ],
      jobsToDo: [
        "Build production-ready AI agents",
        "Develop multiple projects concurrently",
        "Run resource-intensive workloads",
        "Store large codebases and datasets",
        "Integrate with existing systems"
      ],
      pains: [
        "Development environment bottlenecks",
        "Project context switching overhead",
        "Integration with other tools",
        "Professional support needs",
        "Limited resources in free tier"
      ],
      gains: [
        "4× the resources of Free tier",
        "10× the storage capacity",
        "Professional support channels",
        "Enhanced Memory Bank capabilities",
        "Multiple concurrent workspaces",
        "API access for integrations"
      ],
      CTAText: "Upgrade to Pro",
      popular: true,
      gradient: "from-blue-600 to-indigo-700"
    },
    {
      name: "Enterprise",
      productName: "Multi-Agent Command Center",
      description: "Orchestrate complex AI ecosystems with our Multi-Agent Command Center.",
      pricingMonthly: "€21.99",
      pricingAnnual: "€219.90",
      discount: "17% off",
      mainFeatures: [
        { name: "Unlimited workspaces", available: true },
        { name: "8GB RAM, 4 CPU cores", available: true },
        { name: "100GB storage", available: true },
        { name: "A2A Protocol for multi-agent support", available: true },
        { name: "Dedicated networking", available: true },
        { name: "24/7 priority support", available: true },
        { name: "Custom deployment options", available: true },
        { name: "SSO integration", available: true },
        { name: "Enterprise-grade security", available: true },
      ],
      jobsToDo: [
        "Build complex, multi-agent systems",
        "Deploy enterprise-grade AI solutions",
        "Integrate with organizational IT infrastructure",
        "Meet security and compliance standards",
        "Support teams of AI developers"
      ],
      pains: [
        "Scaling development across teams",
        "Agent-to-agent communication complexity",
        "Enterprise authentication requirements",
        "Security and compliance mandates",
        "Resource allocation challenges"
      ],
      gains: [
        "4× the resources of Pro tier",
        "A2A Protocol for multi-agent systems",
        "SSO and enterprise authentication",
        "Unlimited workspaces for teams",
        "Custom deployment options",
        "Advanced security and isolation",
        "24/7 dedicated support"
      ],
      CTAText: "Contact Sales",
      popular: false,
      gradient: "from-purple-600 to-pink-700"
    }
  ];

  const capabilities = [
    {
      category: "Workspace Resources",
      capabilities: [
        { 
          name: "Workspaces", 
          free: "1 workspace", 
          pro: "Up to 5 workspaces", 
          enterprise: "Unlimited workspaces",
          icon: <Container className="h-5 w-5" />
        },
        { 
          name: "Memory", 
          free: "512MB RAM", 
          pro: "2GB RAM per workspace", 
          enterprise: "8GB RAM per workspace",
          icon: <Brain className="h-5 w-5" />
        },
        { 
          name: "CPU", 
          free: "0.5 CPU cores", 
          pro: "2 CPU cores per workspace", 
          enterprise: "4 CPU cores per workspace",
          icon: <Layers className="h-5 w-5" />
        },
        { 
          name: "Storage", 
          free: "5GB total", 
          pro: "50GB total", 
          enterprise: "100GB total",
          icon: <HardDrive className="h-5 w-5" />
        },
        { 
          name: "Workspace Uptime", 
          free: "Suspended after 3 hours of inactivity", 
          pro: "Suspended after 24 hours of inactivity", 
          enterprise: "Custom uptime policies",
          icon: <Clock className="h-5 w-5" />
        }
      ]
    },
    {
      category: "AI Integration",
      capabilities: [
        { 
          name: "Claude CLI", 
          free: "Basic access", 
          pro: "Advanced access", 
          enterprise: "Full access",
          icon: <Brain className="h-5 w-5" />
        },
        { 
          name: "MCP Server", 
          free: "Limited tools", 
          pro: "Enhanced tools", 
          enterprise: "All tools + custom",
          icon: <Server className="h-5 w-5" />
        },
        { 
          name: "Memory Bank", 
          free: "3MB storage", 
          pro: "200MB storage", 
          enterprise: "Unlimited storage",
          icon: <Database className="h-5 w-5" />
        },
        { 
          name: "A2A Protocol", 
          free: "Not available", 
          pro: "Not available", 
          enterprise: "Full support",
          icon: <Network className="h-5 w-5" />
        },
        { 
          name: "Custom Agents", 
          free: "Basic templates", 
          pro: "Standard templates", 
          enterprise: "Custom templates",
          icon: <Wrench className="h-5 w-5" />
        }
      ]
    },
    {
      category: "Security & Administration",
      capabilities: [
        { 
          name: "AppArmor Profiles", 
          free: "Standard profile", 
          pro: "Standard profile", 
          enterprise: "Custom profiles",
          icon: <Shield className="h-5 w-5" />
        },
        { 
          name: "Authentication", 
          free: "Email + password", 
          pro: "Email + password + 2FA", 
          enterprise: "SSO + custom auth",
          icon: <Users className="h-5 w-5" />
        },
        { 
          name: "Networking", 
          free: "Shared network", 
          pro: "Enhanced isolation", 
          enterprise: "Dedicated networks",
          icon: <Network className="h-5 w-5" />
        },
        { 
          name: "Compliance", 
          free: "Basic compliance", 
          pro: "Standard compliance", 
          enterprise: "Enterprise compliance",
          icon: <Shield className="h-5 w-5" />
        },
        { 
          name: "Audit Logs", 
          free: "Not available", 
          pro: "30-day retention", 
          enterprise: "Unlimited retention",
          icon: <Database className="h-5 w-5" />
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I choose the right subscription tier?",
      answer: "Choose based on your resource needs, number of workspaces required, and whether you need advanced features. The Free tier is perfect for experimentation and learning, Pro adds more resources and workspaces for professional development, and Enterprise enables multi-agent capabilities, unlimited workspaces, and advanced security features."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes! You can upgrade your plan at any time, with immediate access to additional resources and features. Downgrades take effect at the end of your current billing cycle. Your data will be preserved when upgrading, though some restrictions may apply when downgrading due to resource limitations."
    },
    {
      question: "What happens if I exceed my resource limits?",
      answer: "If you approach your resource limits, you'll receive notifications. Once limits are reached, your workspaces will continue to run, but performance may be affected. For storage, you won't be able to add more files once you reach your limit. We recommend upgrading to a higher tier if you consistently approach resource limits."
    },
    {
      question: "Do you offer discounts for academic or nonprofit organizations?",
      answer: "Yes, we offer special pricing for academic institutions, research organizations, and nonprofit entities. Please contact our sales team through the 'Contact Sales' button on the Enterprise plan to discuss your specific requirements and eligibility for these special rates."
    },
    {
      question: "Can I use my own Anthropic API key?",
      answer: "Yes, all subscription tiers support using your own Anthropic API key. This gives you complete control over your Claude usage and allows you to leverage existing API contracts with Anthropic. Using your own key may provide better rate limits depending on your Anthropic service tier."
    },
    {
      question: "Is there a difference in security between the tiers?",
      answer: "All tiers benefit from our core security features, including containerization and AppArmor profiles. The Enterprise tier includes additional security capabilities like custom AppArmor profiles, SSO integration, dedicated networking, and advanced audit logging, making it suitable for organizations with strict security requirements."
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
                <span className="text-xl font-bold font-display">ClaudeOSaar</span>
                <span className="text-xs text-neutral-400 block -mt-1">Pricing</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-neutral-300 hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="text-white font-medium">Pricing</Link>
              <Link href="/docs" className="text-neutral-300 hover:text-white transition-colors">Documentation</Link>
              <Button onClick={() => router.push('/signup')}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="primary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose the Perfect Workspace for Your AI Development
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-12">
            From experimentation to enterprise deployment, we have the right resources and features for your AI agent development journey.
          </p>
          
          {/* Billing Interval Toggle */}
          <div className="inline-flex items-center bg-neutral-900 rounded-lg p-1 mb-16">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'monthly' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'annual' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Annual billing <span className="text-xs opacity-75">(save up to 17%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                <Card className={`h-full flex flex-col ${tier.popular ? 'border-primary-600 bg-gradient-to-br from-neutral-900 to-neutral-900/80' : 'bg-neutral-900 border-neutral-800'}`}>
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="mb-2 self-start">{tier.name}</Badge>
                    <h3 className="text-xl font-bold text-white">{tier.productName}</h3>
                    <p className="text-neutral-400">{tier.description}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <p className="text-4xl font-bold text-white">
                        {billingInterval === 'monthly' ? tier.pricingMonthly : tier.pricingAnnual}
                      </p>
                      {tier.name !== "Free" && (
                        <div className="flex items-center mt-1">
                          <p className="text-neutral-400 text-sm">
                            {billingInterval === 'monthly' ? 'per month' : 'per year'}
                          </p>
                          {billingInterval === 'annual' && tier.discount && (
                            <Badge variant="primary" className="ml-2 text-xs">{tier.discount}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Tabs defaultValue="features" className="w-full">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="jobs">Jobs</TabsTrigger>
                        <TabsTrigger value="value">Value</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="features" className="space-y-4">
                        <ul className="space-y-3">
                          {tier.mainFeatures.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start gap-3">
                              {feature.available ? (
                                <div className="p-0.5 rounded-full bg-green-500/20 text-green-500 mt-0.5 flex-shrink-0">
                                  <Check className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="p-0.5 rounded-full bg-neutral-800 text-neutral-500 mt-0.5 flex-shrink-0">
                                  <X className="h-4 w-4" />
                                </div>
                              )}
                              <span className={`${feature.available ? 'text-neutral-200' : 'text-neutral-500'}`}>
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="jobs" className="space-y-4">
                        <h4 className="text-sm font-medium text-neutral-400 mb-2">Jobs to be Done</h4>
                        <ul className="space-y-3">
                          {tier.jobsToDo.map((job, jIndex) => (
                            <li key={jIndex} className="flex items-start gap-3">
                              <div className="p-0.5 rounded-full bg-blue-500/20 text-blue-500 mt-0.5 flex-shrink-0">
                                <Check className="h-4 w-4" />
                              </div>
                              <span className="text-neutral-300">{job}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="value" className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-red-400 mb-2">Pains Relieved</h4>
                          <ul className="space-y-2">
                            {tier.pains.map((pain, pIndex) => (
                              <li key={pIndex} className="flex items-start gap-2">
                                <div className="p-0.5 rounded-full bg-red-500/20 text-red-400 mt-0.5 flex-shrink-0">
                                  <X className="h-3 w-3" />
                                </div>
                                <span className="text-sm text-neutral-300">{pain}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-green-400 mb-2">Gains Created</h4>
                          <ul className="space-y-2">
                            {tier.gains.map((gain, gIndex) => (
                              <li key={gIndex} className="flex items-start gap-2">
                                <div className="p-0.5 rounded-full bg-green-500/20 text-green-400 mt-0.5 flex-shrink-0">
                                  <Check className="h-3 w-3" />
                                </div>
                                <span className="text-sm text-neutral-300">{gain}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className={`w-full ${tier.popular ? 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700' : ''}`}
                      variant={tier.popular ? 'default' : 'outline'}
                      onClick={() => router.push(tier.name === 'Enterprise' ? '/contact' : '/signup')}
                    >
                      {tier.CTAText}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Capabilities Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Detailed Capabilities Comparison
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              See how each subscription tier's features and resources compare in detail
            </p>
          </div>

          <div className="space-y-12">
            {capabilities.map((category, catIndex) => (
              <div key={catIndex} className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                <div className="bg-neutral-800 py-4 px-6">
                  <h3 className="text-lg font-semibold">{category.category}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="py-4 px-6 text-left text-sm font-medium text-neutral-400 w-1/4">Capability</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-neutral-400 w-1/4">Free</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-neutral-400 w-1/4">Pro</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-neutral-400 w-1/4">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {category.capabilities.map((capability, capIndex) => (
                        <tr key={capIndex} className="hover:bg-neutral-800/50">
                          <td className="py-4 px-6 flex items-center gap-2">
                            <div className="text-neutral-500">
                              {capability.icon}
                            </div>
                            <span className="font-medium">{capability.name}</span>
                          </td>
                          <td className="py-4 px-6 text-neutral-300">{capability.free}</td>
                          <td className="py-4 px-6 text-neutral-300">{capability.pro}</td>
                          <td className="py-4 px-6 text-neutral-300">{capability.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
              Find answers to common questions about our pricing and subscription tiers
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-900/50 to-neutral-950">
        <div className="max-w-4xl mx-auto">
          <Card className="border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-900/80 overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="primary" className="mb-3">Enterprise Solutions</Badge>
                  <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
                  <p className="text-neutral-300 mb-6">
                    Our Enterprise tier is flexible and can be tailored to meet the specific requirements of your organization, with custom resource allocations, security features, and deployment options.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
                    onClick={() => router.push('/contact')}
                  >
                    Contact Sales for Custom Quote
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <Shield className="h-8 w-8 text-primary-500 mb-2" />
                    <h4 className="font-medium mb-1">Custom Security</h4>
                    <p className="text-sm text-neutral-400">Enhanced security profiles and compliance features</p>
                  </div>
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <Users className="h-8 w-8 text-accent-500 mb-2" />
                    <h4 className="font-medium mb-1">Team Features</h4>
                    <p className="text-sm text-neutral-400">Role-based access and team collaboration tools</p>
                  </div>
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <Server className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-medium mb-1">Custom Deployment</h4>
                    <p className="text-sm text-neutral-400">On-premise or dedicated cloud options</p>
                  </div>
                  <div className="p-4 bg-neutral-800/50 rounded-lg">
                    <Network className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="font-medium mb-1">Network Isolation</h4>
                    <p className="text-sm text-neutral-400">Dedicated networking and integration options</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-primary-500" />
                <span className="text-lg font-bold font-display">ClaudeOSaar</span>
              </div>
              <p className="text-neutral-400 text-sm">
                The sovereign AI development platform from Saarland
              </p>
              <div className="flex justify-center gap-6 mt-4">
                <Link href="/terms" className="text-neutral-400 hover:text-white text-sm">Terms</Link>
                <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm">Privacy</Link>
                <Link href="/contact" className="text-neutral-400 hover:text-white text-sm">Contact</Link>
              </div>
              <p className="text-neutral-500 text-xs mt-4">
                &copy; 2025 ClaudeOSaar. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}