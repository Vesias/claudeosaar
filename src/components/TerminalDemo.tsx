import React, { useEffect, useState } from 'react';
// Dynamically import motion from framer-motion to avoid SSR issues
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const commands = [
  { input: '$ claude --help', output: 'Claude CLI v2.3.0 - AI Assistant in your terminal', delay: 0 },
  { input: '', output: 'Usage:', delay: 100 },
  { input: '', output: '  claude [command] [flags]', delay: 150 },
  { input: '', output: '', delay: 200 },
  { input: '', output: 'Commands:', delay: 250 },
  { input: '', output: '  chat     Start an interactive chat session', delay: 300 },
  { input: '', output: '  run      Execute a command with AI assistance', delay: 350 },
  { input: '', output: '  search   Search memory bank for context', delay: 400 },
  { input: '', output: '', delay: 500 },
  { input: '$ claude run "create a Python FastAPI server with user authentication"', output: '', delay: 1000 },
  { input: '', output: '✓ Created main.py with FastAPI application', delay: 1500 },
  { input: '', output: '✓ Added JWT authentication middleware', delay: 1700 },
  { input: '', output: '✓ Created user models and database schema', delay: 1900 },
  { input: '', output: '✓ Generated requirements.txt', delay: 2100 },
  { input: '', output: '✓ Server ready at http://localhost:8000', delay: 2300 },
];

const TerminalDemo: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentChar, setCurrentChar] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('1');

  // Stats for enterprise dashboard feel
  const stats = [
    { label: 'Active Developers', value: '1382' },
    { label: 'AI Queries Processed', value: '5.6M' },
    { label: 'Uptime SLA', value: '99.99%' },
    { label: 'Enterprise Support', value: '24/7' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleLines < commands.length) {
        const currentCommand = commands[visibleLines];
        
        if (currentCommand.input && currentChar < currentCommand.input.length) {
          // Type the input character by character
          setIsTyping(true);
          setCurrentChar(currentChar + 1);
        } else {
          // Show the output and move to next line
          setIsTyping(false);
          setCurrentChar(0);
          setVisibleLines(visibleLines + 1);
        }
      } else {
        // Reset the animation
        setTimeout(() => {
          setVisibleLines(0);
          setCurrentChar(0);
        }, 2000);
      }
    }, isTyping ? 30 : commands[visibleLines]?.delay || 100);

    return () => clearTimeout(timer);
  }, [visibleLines, currentChar, isTyping]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Stats bar for enterprise feel */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Experience the Power of Claude CLI
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            AI-powered development right in your terminal
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Terminal Window */}
          <div className="relative bg-neutral-950 rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            {/* Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 opacity-30" />
            
            <div className="relative">
              {/* Terminal Header with Tabs */}
              <div className="bg-neutral-800 border-b border-neutral-700">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center">
                    <button className="px-1 py-0.5 text-xs text-neutral-400 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                    <button className="px-1 py-0.5 ml-2 text-xs text-neutral-400 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex px-2 pt-1">
                  {['1', '2', '3'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm font-medium rounded-t-md relative ${
                        activeTab === tab
                          ? 'text-white bg-neutral-950 border-t border-l border-r border-neutral-700'
                          : 'text-neutral-400 hover:text-neutral-300'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === '1' ? 'workspace-1 — claude@claudeosaar' : `workspace-${tab}`}
                      {tab === activeTab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                      )}
                    </button>
                  ))}
                  <button className="px-3 py-2 text-neutral-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-base">
                <pre className="text-green-400 leading-loose">
                  {commands.slice(0, visibleLines + 1).map((cmd, index) => (
                    <React.Fragment key={index}>
                      {cmd.input && (
                        <div
                          className="mb-1"
                        >
                          {index === visibleLines && currentChar < cmd.input.length ? (
                            <>
                              <span className="text-neutral-400">{cmd.input.slice(0, currentChar)}</span>
                              <span
                                className="inline-block w-2 h-4 bg-green-400 animate-pulse"
                              />
                            </>
                          ) : (
                            <span className="text-neutral-400">{cmd.input}</span>
                          )}
                        </div>
                      )}
                      {(index < visibleLines || (index === visibleLines && currentChar >= (cmd.input?.length || 0))) && cmd.output && (
                        <div
                          className={`${cmd.output.startsWith('✓') ? 'text-emerald-400' : 'text-cyan-400'} mb-1 pl-2`}
                        >
                          {cmd.output}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </pre>
              </div>

              {/* Terminal Bottom Bar */}
              <div className="px-6 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center text-xs text-neutral-500">
                <div className="flex-1">
                  <span className="mr-4">claudeosaar v2.3.0</span>
                  <span className="mr-4">node v20.10.0</span>
                  <span>python 3.12.0</span>
                </div>
                <div>
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Last command: 23ms</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          </div>

          {/* Background Decoration */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 blur-3xl -z-10" />
          
          {/* Demo Controls */}
          <div className="flex justify-center mt-8">
            <a href="#" className="inline-flex items-center px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
              Watch Demo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </a>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default TerminalDemo;