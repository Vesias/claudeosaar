import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Copy, Play, X, Maximize2, Minimize2, Clipboard, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

// Terminal session type
type TerminalSession = {
  id: string;
  title: string;
  active: boolean;
  command: string;
  output: string[];
};

export const TerminalAccess: React.FC = () => {
  const [sessions, setSessions] = useState<TerminalSession[]>([
    { id: '1', title: 'Session 1', active: true, command: '', output: ['Welcome to ClaudeOSaar Terminal v2.3.0', 'Type "help" for available commands.', '] }
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastCommand, setLastCommand] = useState('');
  const terminalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find(s => s.active) || sessions[0];

  // Focus command input when terminal is clicked
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        terminalRefs.current.some(ref => 
          ref && ref.contains(event.target as Node)
        ) && 
        commandInputRef.current
      ) {
        commandInputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const addNewSession = () => {
    const newId = (sessions.length + 1).toString();
    setSessions(prev => [
      ...prev.map(s => ({ ...s, active: false })),
      { 
        id: newId, 
        title: `Session ${newId}`, 
        active: true, 
        command: '',
        output: ['New terminal session started.', ']
      }
    ]);
  };

  const closeSession = (id: string) => {
    if (sessions.length <= 1) return;
    
    const sessionIndex = sessions.findIndex(s => s.id === id);
    const isActive = sessions[sessionIndex].active;
    
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);
      
      // Set another session active if we closed the active one
      if (isActive && newSessions.length > 0) {
        const newActiveIndex = Math.min(sessionIndex, newSessions.length - 1);
        newSessions[newActiveIndex] = { ...newSessions[newActiveIndex], active: true };
      }
      
      return newSessions;
    });
  };

  const setActiveSession = (id: string) => {
    setSessions(prev => 
      prev.map(s => ({ ...s, active: s.id === id }))
    );
  };

  const executeCommand = () => {
    if (!activeSession || !activeSession.command.trim()) return;
    
    const command = activeSession.command.trim();
    
    // Add to history if not a duplicate of the last command
    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== command) {
      setCommandHistory(prev => [...prev, command]);
    }
    
    setHistoryIndex(-1);
    setLastCommand('');
    
    // Mock execution - in reality would send to backend
    const output = `Executing: ${command}\n\n$ `;
    
    setSessions(prev => 
      prev.map(s => 
        s.id === activeSession.id 
          ? { 
              ...s, 
              output: [...s.output, `$ ${command}`, output], 
              command: '' 
            } 
          : s
      )
    );
  };

  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeSession) return;
    
    setSessions(prev => 
      prev.map(s => 
        s.id === activeSession.id 
          ? { ...s, command: e.target.value } 
          : s
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (historyIndex === -1) {
        setLastCommand(activeSession.command);
      }
      
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        
        setSessions(prev => 
          prev.map(s => 
            s.id === activeSession.id 
              ? { ...s, command: commandHistory[commandHistory.length - 1 - newIndex] } 
              : s
          )
        );
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        
        setSessions(prev => 
          prev.map(s => 
            s.id === activeSession.id 
              ? { ...s, command: commandHistory[commandHistory.length - 1 - newIndex] } 
              : s
          )
        );
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        
        setSessions(prev => 
          prev.map(s => 
            s.id === activeSession.id 
              ? { ...s, command: lastCommand } 
              : s
          )
        );
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete would go here
    } else if (e.key === 'c' && e.ctrlKey) {
      // CTRL+C handling
      setSessions(prev => 
        prev.map(s => 
          s.id === activeSession.id 
            ? { ...s, output: [...s.output, '^C', '], command: '' } 
            : s
        )
      );
    }
  };

  const copyToClipboard = () => {
    if (!activeSession) return;
    
    const text = activeSession.output.join('\n');
    navigator.clipboard.writeText(text);
    // Could show a toast notification here
  };

  const downloadTerminalOutput = () => {
    if (!activeSession) return;
    
    const text = activeSession.output.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-session-${activeSession.id}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn(
      "rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all bg-white dark:bg-neutral-900",
      isFullscreen && "fixed inset-0 z-50 rounded-none w-full h-full"
    )}>
      <div className="bg-neutral-100 dark:bg-neutral-900 p-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TerminalIcon className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
            <div className="text-lg font-medium">Terminal Access</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 p-0 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => setShowHistory(!showHistory)}
              title={showHistory ? 'Hide command history' : 'Show command history'}
            >
              <Clipboard className="w-4 h-4" />
            </button>
            
            <button
              className="w-8 h-8 p-0 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              className="w-8 h-8 p-0 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={downloadTerminalOutput}
              title="Download output"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              className="w-8 h-8 p-0 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? 
                <Minimize2 className="w-4 h-4" /> : 
                <Maximize2 className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex h-full">
        {showHistory && (
          <div className="w-64 border-r border-neutral-200 dark:border-neutral-800 p-2 overflow-y-auto">
            <div className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Command History
            </div>
            <div className="space-y-1">
              {commandHistory.length === 0 ? (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                  No commands yet
                </div>
              ) : (
                commandHistory.slice().reverse().map((cmd, idx) => (
                  <div 
                    key={idx}
                    className="p-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer"
                    onClick={() => {
                      setSessions(prev => 
                        prev.map(s => 
                          s.id === activeSession.id 
                            ? { ...s, command: cmd } 
                            : s
                        )
                      );
                      if (commandInputRef.current) {
                        commandInputRef.current.focus();
                      }
                    }}
                  >
                    {cmd}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3">
            <div className="flex items-center h-10">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  className={cn(
                    "relative px-4 h-10 text-sm font-medium",
                    session.active 
                      ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                  )}
                  onClick={() => setActiveSession(session.id)}
                >
                  {session.title}
                  {sessions.length > 1 && (
                    <button
                      className="ml-2 w-5 h-5 p-0 rounded-full opacity-50 hover:opacity-100 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeSession(session.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </button>
              ))}
              <button
                className="ml-2 h-8 w-8 p-0 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={addNewSession}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
          
          {sessions.map((session, idx) => (
            <div
              key={session.id}
              ref={el => terminalRefs.current[idx] = el}
              className={cn(
                "flex-1 bg-black p-4 font-mono text-green-400 text-sm overflow-y-auto",
                !session.active && "hidden"
              )}
            >
              {session.output.map((line, lineIdx) => (
                <div key={lineIdx}>{line}</div>
              ))}
            </div>
          ))}
          
          <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center">
            <span className="text-primary-600 dark:text-primary-400 mr-2 font-mono">$</span>
            <input
              ref={commandInputRef}
              className="flex-1 bg-transparent border-none outline-none text-sm font-mono dark:text-white"
              value={activeSession.command}
              onChange={handleCommandChange}
              onKeyDown={handleKeyDown}
              placeholder="Type command here..."
            />
            <button
              className="ml-2 p-1 rounded text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={executeCommand}
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};