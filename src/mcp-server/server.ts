/**
 * ClaudeOSaar MCP Server
 * Provides AI tools for workspace development
 */

import express from 'express';
import expressWs from 'express-ws';
import { Logger } from '../utils/logger';
import { ContainerManager } from '../containers/container-manager';
import { promises as fs } from 'fs';
import path from 'path';
import cors from 'cors';

interface ToolParams {
  workspaceId: string;
  [key: string]: any;
}

interface ToolResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class MCPServer {
  private app: express.Application;
  private wsApp: any;
  private logger: Logger;
  private containerManager: ContainerManager;
  private port: number;

  constructor(port = 6602) {
    this.app = express();
    this.wsApp = expressWs(this.app);
    this.logger = new Logger('MCPServer');
    this.containerManager = new ContainerManager();
    this.port = port;
    
    this.setupMiddleware();
    this.registerRoutes();
    this.registerTools();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    
    // Request logging
    this.app.use((req, _res, next) => {
      this.logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private registerRoutes() {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // List available tools
    this.app.get('/tools', (_req, res) => {
      res.json(this.getAvailableTools());
    });

    // Tool execution endpoint
    this.app.post('/tools/:toolName', async (req, res) => {
      const { toolName } = req.params;
      const params = req.body;
      
      try {
        const result = await this.executeTool(toolName, params);
        res.json(result);
      } catch (error) {
        this.logger.error(`Tool execution error: ${error}`);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  private getAvailableTools() {
    return {
      filesystem: {
        read: {
          description: 'Read file contents from a workspace',
          parameters: {
            workspaceId: { type: 'string', required: true },
            path: { type: 'string', required: true }
          }
        },
        write: {
          description: 'Write content to a file in a workspace',
          parameters: {
            workspaceId: { type: 'string', required: true },
            path: { type: 'string', required: true },
            content: { type: 'string', required: true }
          }
        },
        list: {
          description: 'List files in a directory',
          parameters: {
            workspaceId: { type: 'string', required: true },
            path: { type: 'string', required: true }
          }
        }
      },
      terminal: {
        execute: {
          description: 'Execute a command in a workspace container',
          parameters: {
            workspaceId: { type: 'string', required: true },
            command: { type: 'string', required: true },
            cwd: { type: 'string', required: false }
          }
        }
      },
      memoryBank: {
        store: {
          description: 'Store information in the memory bank',
          parameters: {
            workspaceId: { type: 'string', required: true },
            key: { type: 'string', required: true },
            content: { type: 'string', required: true },
            metadata: { type: 'object', required: false }
          }
        },
        retrieve: {
          description: 'Retrieve information from the memory bank',
          parameters: {
            workspaceId: { type: 'string', required: true },
            key: { type: 'string', required: true }
          }
        },
        search: {
          description: 'Search the memory bank',
          parameters: {
            workspaceId: { type: 'string', required: true },
            query: { type: 'string', required: true },
            limit: { type: 'number', required: false }
          }
        }
      }
    };
  }

  private async executeTool(toolName: string, params: ToolParams): Promise<ToolResponse> {
    const [category, action] = toolName.split('.');
    
    switch (category) {
      case 'filesystem':
        return await this.executeFilesystemTool(action, params);
      case 'terminal':
        return await this.executeTerminalTool(action, params);
      case 'memoryBank':
        return await this.executeMemoryBankTool(action, params);
      default:
        throw new Error(`Unknown tool category: ${category}`);
    }
  }

  private async executeFilesystemTool(action: string, params: ToolParams): Promise<ToolResponse> {
    const workspacePath = `/user_mounts/${params.workspaceId}`;
    
    switch (action) {
      case 'read': {
        const filePath = path.join(workspacePath, params.path);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          return { success: true, data: { content } };
        } catch (error) {
          throw new Error(`Failed to read file: ${error}`);
        }
      }
      
      case 'write': {
        const filePath = path.join(workspacePath, params.path);
        try {
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, params.content);
          return { success: true, data: { path: params.path } };
        } catch (error) {
          throw new Error(`Failed to write file: ${error}`);
        }
      }
      
      case 'list': {
        const dirPath = path.join(workspacePath, params.path);
        try {
          const entries = await fs.readdir(dirPath, { withFileTypes: true });
          const files = entries.map(entry => ({
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            path: path.join(params.path, entry.name)
          }));
          return { success: true, data: { files } };
        } catch (error) {
          throw new Error(`Failed to list directory: ${error}`);
        }
      }
      
      default:
        throw new Error(`Unknown filesystem action: ${action}`);
    }
  }

  private async executeTerminalTool(action: string, params: ToolParams): Promise<ToolResponse> {
    switch (action) {
      case 'execute': {
        const { workspaceId, command } = params;
        
        try {
          // Execute command in container
          const containerInfo = await this.containerManager.getContainerInfo(workspaceId);
          if (!containerInfo || containerInfo.status !== 'running') {
            throw new Error('Workspace container is not running');
          }
          
          // Mock execution for now - will be replaced with actual docker exec
          this.logger.info(`Executing command in workspace ${workspaceId}: ${command}`);
          
          return {
            success: true,
            data: {
              output: `Mock output for command: ${command}`,
              exitCode: 0
            }
          };
        } catch (error) {
          throw new Error(`Failed to execute command: ${error}`);
        }
      }
      
      default:
        throw new Error(`Unknown terminal action: ${action}`);
    }
  }

  private async executeMemoryBankTool(action: string, params: ToolParams): Promise<ToolResponse> {
    const memoryPath = `/user_mounts/${params.workspaceId}/.claude/memory-bank`;
    
    switch (action) {
      case 'store': {
        try {
          await fs.mkdir(memoryPath, { recursive: true });
          const filePath = path.join(memoryPath, `${params.key}.json`);
          const data = {
            content: params.content,
            metadata: params.metadata || {},
            timestamp: new Date().toISOString()
          };
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          return { success: true, data: { key: params.key } };
        } catch (error) {
          throw new Error(`Failed to store in memory bank: ${error}`);
        }
      }
      
      case 'retrieve': {
        try {
          const filePath = path.join(memoryPath, `${params.key}.json`);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content);
          return { success: true, data };
        } catch (error) {
          throw new Error(`Failed to retrieve from memory bank: ${error}`);
        }
      }
      
      case 'search': {
        try {
          const files = await fs.readdir(memoryPath);
          const results = [];
          
          for (const file of files) {
            if (file.endsWith('.json')) {
              const filePath = path.join(memoryPath, file);
              const content = await fs.readFile(filePath, 'utf-8');
              const data = JSON.parse(content);
              
              // Simple search in content and metadata
              const searchText = JSON.stringify(data).toLowerCase();
              if (searchText.includes(params.query.toLowerCase())) {
                results.push({
                  key: file.replace('.json', ''),
                  content: data.content,
                  metadata: data.metadata,
                  timestamp: data.timestamp
                });
              }
            }
          }
          
          const limit = params.limit || 10;
          return { success: true, data: { results: results.slice(0, limit) } };
        } catch (error) {
          throw new Error(`Failed to search memory bank: ${error}`);
        }
      }
      
      default:
        throw new Error(`Unknown memory bank action: ${action}`);
    }
  }

  private registerTools() {
    // WebSocket endpoint for real-time terminal access
    (this.app as any).ws('/terminal', (ws: any, req: any) => {
      const workspaceId = req.query.workspaceId as string;
      
      ws.on('message', async (message: any) => {
        try {
          const data = JSON.parse(message.toString());
          
          if (data.type === 'input') {
            // Forward input to container terminal
            this.logger.info(`Terminal input for workspace ${workspaceId}: ${data.data}`);
            
            // Mock response for now
            ws.send(JSON.stringify({
              type: 'output',
              data: `Echo: ${data.data}\r\n`
            }));
          }
        } catch (error) {
          this.logger.error('Terminal WebSocket error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            data: 'Failed to process terminal input'
          }));
        }
      });
      
      ws.on('close', () => {
        this.logger.info(`Terminal WebSocket closed for workspace ${workspaceId}`);
      });
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      this.logger.info(`MCP Server running on port ${this.port}`);
    });
  }
}

// Start the server if this module is executed directly
if (require.main === module) {
  const server = new MCPServer();
  server.start();
}