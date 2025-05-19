import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useAuth } from '../../context/AuthContext';
import { withAuth } from '../../components/withAuth';
import {
  ArrowLeft,
  Terminal as TerminalIcon,
  Activity,
  Settings,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  FileText,
  Database,
  Brain
} from 'lucide-react';
import 'xterm/css/xterm.css';

// Dynamically import XTerm to avoid SSR issues
const XTermComponent = dynamic(
  () => Promise.resolve(TerminalComponent),
  { ssr: false }
);

function TerminalComponent({ workspaceId, token }: { workspaceId: string; token: string }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create terminal instance
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0a0a0a',
        foreground: '#e0e0e0',
        cursor: '#00ff00',
        black: '#2e3436',
        red: '#cc0000',
        green: '#4e9a06',
        yellow: '#c4a000',
        blue: '#3465a4',
        magenta: '#75507b',
        cyan: '#06989a',
        white: '#d3d7cf',
        brightBlack: '#555753',
        brightRed: '#ef2929',
        brightGreen: '#8ae234',
        brightYellow: '#fce94f',
        brightBlue: '#729fcf',
        brightMagenta: '#ad7fa8',
        brightCyan: '#34e2e2',
        brightWhite: '#eeeeec',
      },
    });

    // Add addons
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    // Open terminal in DOM
    term.open(terminalRef.current);
    fitAddon.fit();
    
    setTerminal(term);

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Connect WebSocket (for development, use mock connection)
    if (process.env.NODE_ENV === 'development') {
      // Mock connection for development
      setStatus('connected');
      term.writeln('Welcome to ClaudeOSaar Workspace Terminal');
      term.writeln(`Workspace: ${workspaceId}`);
      term.writeln('');
      term.write('$ ');
    } else {
      // Real WebSocket connection for production
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/terminal/${workspaceId}`;
      const websocket = new WebSocket(wsUrl);
      
      websocket.onopen = () => {
        setStatus('connected');
        websocket.send(JSON.stringify({
          type: 'resize',
          cols: term.cols,
          rows: term.rows,
        }));
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'output':
            term.write(message.data);
            break;
          case 'exit':
            setStatus('disconnected');
            term.write('\r\n\r\n[Process completed]\r\n');
            break;
          case 'error':
            term.write(`\r\n\x1b[31mError: ${message.message}\x1b[0m\r\n`);
            break;
        }
      };

      websocket.onclose = () => {
        setStatus('disconnected');
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('disconnected');
      };

      setWs(websocket);

      // Handle terminal input
      term.onData((data) => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'input',
            data,
          }));
        }
      });

      // Handle terminal resize
      term.onResize(({ cols, rows }) => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'resize',
            cols,
            rows,
          }));
        }
      });

      // Send auth token
      websocket.addEventListener('open', () => {
        websocket.send(JSON.stringify({
          type: 'auth',
          token,
        }));
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [workspaceId, token]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      fitAddonRef.current?.fit();
    }, 0);
  };

  const handleCopy = () => {
    const selection = terminal?.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
  };

  const handleReconnect = () => {
    window.location.reload();
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} flex flex-col bg-gray-900`}>
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                status === 'connected' ? 'bg-green-500' : 
                status === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                'bg-red-500'
              }`} />
              <span className="text-sm text-gray-300">
                {status === 'connected' ? 'Connected' : 
                 status === 'connecting' ? 'Connecting...' : 
                 'Disconnected'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Claude CLI v2.3.0
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Copy selection"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            {status === 'disconnected' && (
              <button
                onClick={handleReconnect}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm
                         flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reconnect
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div ref={terminalRef} className="flex-1" />
    </div>
  );
}

function WorkspacePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token } = useAuth();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('terminal');

  useEffect(() => {
    if (!id || !token) return;

    // For development, use mock data
    const mockWorkspace = {
      id: id,
      name: `dev-workspace-${id}`,
      status: 'running',
      createdAt: new Date().toISOString(),
      resources: {
        cpu: '0.5',
        memory: '512MB',
        storage: '5GB'
      }
    };
    
    setWorkspace(mockWorkspace);
    setLoading(false);
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href="/workspace"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/workspace"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">{workspace?.name}</h1>
                <p className="text-sm text-gray-400">Workspace ID: {id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                <Upload className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'terminal'
                  ? 'text-blue-500 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4 w-4" />
                Terminal
              </div>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'text-blue-500 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Files
              </div>
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'memory'
                  ? 'text-blue-500 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Memory Bank
              </div>
            </button>
            <button
              onClick={() => setActiveTab('claude')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'claude'
                  ? 'text-blue-500 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Claude Assistant
              </div>
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'metrics'
                  ? 'text-blue-500 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Metrics
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'terminal' && (
          <XTermComponent workspaceId={id as string} token={token} />
        )}
        {activeTab === 'files' && (
          <div className="p-6 text-gray-400">
            File manager coming soon...
          </div>
        )}
        {activeTab === 'memory' && (
          <div className="p-6 text-gray-400">
            Memory Bank interface coming soon...
          </div>
        )}
        {activeTab === 'claude' && (
          <div className="p-6 text-gray-400">
            Claude Assistant integration coming soon...
          </div>
        )}
        {activeTab === 'metrics' && (
          <div className="p-6 text-gray-400">
            Workspace metrics coming soon...
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(WorkspacePage);