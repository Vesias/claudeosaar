import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the Power of Claude CLI
          </h2>
          <p className="text-xl text-neutral-400">
            AI-powered development right in your terminal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Terminal Window */}
          <div className="relative bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
            {/* Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 opacity-50" />
            
            <div className="relative">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800 border-b border-neutral-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-neutral-400 ml-4">workspace-1 — claude@claudeosaar</span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm">
                <pre className="text-green-400 leading-relaxed">
                  {commands.slice(0, visibleLines + 1).map((cmd, index) => (
                    <React.Fragment key={index}>
                      {cmd.input && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.1 }}
                        >
                          {index === visibleLines && currentChar < cmd.input.length ? (
                            <>
                              <span className="text-neutral-500">{cmd.input.slice(0, currentChar)}</span>
                              <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="inline-block w-2 h-4 bg-green-400"
                              />
                            </>
                          ) : (
                            <span className="text-neutral-500">{cmd.input}</span>
                          )}
                        </motion.div>
                      )}
                      {(index < visibleLines || (index === visibleLines && currentChar >= (cmd.input?.length || 0))) && cmd.output && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cmd.output.startsWith('✓') ? 'text-emerald-400' : 'text-cyan-400'}
                        >
                          {cmd.output}
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}
                </pre>
              </div>
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
          </div>

          {/* Background Decoration */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalDemo;