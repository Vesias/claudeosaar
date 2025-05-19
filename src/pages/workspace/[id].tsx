import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useAuth } from '../../context/AuthContext';
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

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create terminal instance
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc',
      },
    });

    // Add addons
    const fitAddon = new FitAddon();
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

    // Connect WebSocket
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

    // Set authorization header
    websocket.addEventListener('open', () => {
      // Note: WebSocket doesn't support custom headers, so we'll send auth as first message
      websocket.send(JSON.stringify({
        type: 'auth',
        token,
      }));
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [workspaceId, token]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="px-4 py-2 bg-gray-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 
            status === 'connecting' ? 'bg-yellow-500' : 
            'bg-red-500'
          }`} />
          <span className="text-sm">
            {status === 'connected' ? 'Connected' : 
             status === 'connecting' ? 'Connecting...' : 
             'Disconnected'}
          </span>
        </div>
        <button
          onClick={() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.close();
              // Reconnect
              window.location.reload();
            }
          }}
          className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
        >
          {status === 'disconnected' ? 'Reconnect' : 'Restart'}
        </button>
      </div>
      <div ref={terminalRef} className="flex-1 p-2" />
    </div>
  );
}

export default function WorkspacePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !token) return;

    // Fetch workspace details
    fetch(`/api/workspaces/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setWorkspace(data.workspace);
        }
      })
      .catch(err => {
        setError('Failed to load workspace');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading workspace...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{workspace?.name}</h1>
          <p className="text-sm text-gray-400">Workspace ID: {id}</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="flex-1">
        <XTermComponent workspaceId={id as string} token={token} />
      </div>
    </div>
  );
}
