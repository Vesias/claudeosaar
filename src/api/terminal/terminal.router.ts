import { Router } from 'express';
import WebSocket from 'ws';
import { TerminalHandler } from './terminal.handler';
import { ContainerManager } from '../../containers/container-manager';
import { AuthService } from '../auth/auth.service';

export function createTerminalRouter(
  wss: WebSocket.Server,
  containerManager: ContainerManager,
  authService: AuthService
): Router {
  const router = Router();
  const terminalHandler = new TerminalHandler(containerManager, authService);

  // WebSocket upgrade handler
  wss.on('connection', (ws, req) => {
    // Extract workspace ID from URL
    const match = req.url?.match(/\/terminal\/(\w+)/);
    if (match) {
      req.params = { workspaceId: match[1] };
      terminalHandler.handleConnection(ws, req);
    } else {
      ws.close();
    }
  });

  // REST endpoint to get terminal info
  router.get('/workspaces/:workspaceId/terminal', async (req, res) => {
    const { workspaceId } = req.params;
    
    try {
      const containerInfo = await containerManager.getContainerInfo(workspaceId);
      
      if (!containerInfo || containerInfo.status !== 'running') {
        return res.status(503).json({
          error: 'Container not running',
          status: containerInfo?.status || 'not found'
        });
      }

      res.json({
        status: 'available',
        websocketUrl: `/terminal/${workspaceId}`,
        container: {
          status: containerInfo.status,
          terminalPort: containerInfo.ports.terminal
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
