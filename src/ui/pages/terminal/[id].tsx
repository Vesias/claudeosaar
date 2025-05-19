import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';
import 'xterm/css/xterm.css';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TerminalPage() {
  const router = useRouter();
  const { id: workspaceId } = router.query;
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!workspaceId || !terminalRef.current) return;

    // Initialize xterm.js
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5'
      }
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const webglAddon = new WebglAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(webglAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:7681/ws/${workspaceId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      term.write('Connected to ClaudeOSaar workspace\r\n');
      term.write('Type "help" for available commands\r\n\r\n');
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onerror = (error) => {
      term.write(`\r\nError: ${(error as ErrorEvent).message || 'Connection failed'}\r\n`);
    };

    ws.onclose = () => {
      term.write('\r\nConnection closed\r\n');
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    xtermRef.current = term;
    wsRef.current = ws;

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      ws.close();
    };
  }, [workspaceId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">
                Workspace Terminal: {workspaceId}
              </h1>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  if (xtermRef.current) {
                    xtermRef.current.clear();
                  }
                }}
                variant="secondary"
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.close();
                    wsRef.current = null;
                  }
                  router.push('/dashboard');
                }}
                variant="destructive"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="h-full bg-black rounded-lg p-4">
          <div ref={terminalRef} className="h-full" />
        </div>
      </main>
    </div>
  );
}