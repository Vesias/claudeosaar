import WebSocket from 'ws';
import { spawn } from 'node-pty';
import { ContainerManager } from '../../containers/container-manager';
import { AuthService } from '../auth/auth.service';

export interface TerminalSession {
  id: string;
  workspaceId: string;
  userId: string;
  pty: any;
  ws: WebSocket;
}

export class TerminalHandler {
  private sessions: Map<string, TerminalSession> = new Map();
  
  constructor(
    private containerManager: ContainerManager,
    private authService: AuthService
  ) {}

  async handleConnection(ws: WebSocket, req: any) {
    const workspaceId = req.params.workspaceId;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized' }));
      ws.close();
      return;
    }

    try {
      // Verify user has access to workspace
      const user = await this.authService.verifyToken(token);
      if (!user) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
        ws.close();
        return;
      }

      // Check if user owns the workspace
      // This would normally check the database
      const hasAccess = true; // Simplified for now
      
      if (!hasAccess) {
        ws.send(JSON.stringify({ type: 'error', message: 'Access denied' }));
        ws.close();
        return;
      }

      // Create terminal session
      const session = await this.createSession(workspaceId, user.id, ws);
      
      // Handle WebSocket messages
      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'resize':
            if (session.pty) {
              session.pty.resize(message.cols, message.rows);
            }
            break;
            
          case 'input':
            if (session.pty) {
              session.pty.write(message.data);
            }
            break;
        }
      });

      ws.on('close', () => {
        this.closeSession(session.id);
      });

      ws.send(JSON.stringify({ type: 'connected', sessionId: session.id }));
      
    } catch (error) {
      console.error('Terminal connection error:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Connection failed' }));
      ws.close();
    }
  }

  private async createSession(
    workspaceId: string,
    userId: string,
    ws: WebSocket
  ): Promise<TerminalSession> {
    const sessionId = `${workspaceId}-${Date.now()}`;
    
    // Get container info
    const containerInfo = await this.containerManager.getContainerInfo(workspaceId);
    
    if (!containerInfo || containerInfo.status !== 'running') {
      throw new Error('Container not running');
    }

    // Create PTY that connects to the container
    const pty = spawn('docker', [
      'exec',
      '-it',
      containerInfo.name,
      '/bin/bash'
    ], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: '/workspace',
      env: process.env
    });

    pty.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'output',
          data: data.toString()
        }));
      }
    });

    pty.on('exit', (code, signal) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'exit',
          code,
          signal
        }));
        ws.close();
      }
      this.closeSession(sessionId);
    });

    const session: TerminalSession = {
      id: sessionId,
      workspaceId,
      userId,
      pty,
      ws
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  private closeSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      if (session.pty) {
        session.pty.kill();
      }
      if (session.ws.readyState === WebSocket.OPEN) {
        session.ws.close();
      }
      this.sessions.delete(sessionId);
    }
  }

  closeAllSessions() {
    for (const [sessionId] of this.sessions) {
      this.closeSession(sessionId);
    }
  }
}
