import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Define available tools
const TOOLS = {
  filesystem_read: {
    description: 'Read a file from the workspace filesystem',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the file to read' },
      },
      required: ['path'],
    },
  },
  filesystem_write: {
    description: 'Write a file to the workspace filesystem',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the file to write' },
        content: { type: 'string', description: 'Content to write to the file' },
      },
      required: ['path', 'content'],
    },
  },
  filesystem_list: {
    description: 'List files and directories in a path',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to list (default: current directory)' },
      },
    },
  },
  terminal_execute: {
    description: 'Execute a command in the container terminal',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Command to execute' },
        cwd: { type: 'string', description: 'Working directory (optional)' },
      },
      required: ['command'],
    },
  },
  memory_store: {
    description: 'Store data in the memory bank',
    inputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Key to store data under' },
        value: { type: 'any', description: 'Value to store' },
        metadata: { type: 'object', description: 'Optional metadata' },
      },
      required: ['key', 'value'],
    },
  },
  memory_retrieve: {
    description: 'Retrieve data from the memory bank',
    inputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Key to retrieve data from' },
      },
      required: ['key'],
    },
  },
  memory_search: {
    description: 'Search the memory bank using semantic similarity',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'integer', description: 'Maximum results (default: 10)' },
      },
      required: ['query'],
    },
  },
};

export class ClaudeOSaarMCPServer {
  private server: Server;
  private workspacePath: string;
  private memoryBankPath: string;

  constructor(config: { workspacePath: string; memoryBankPath: string }) {
    this.workspacePath = config.workspacePath;
    this.memoryBankPath = config.memoryBankPath;
    this.server = new Server(
      {
        name: 'claudeosaar-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Object.entries(TOOLS).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'filesystem_read':
            return await this.handleFileRead(args);
          case 'filesystem_write':
            return await this.handleFileWrite(args);
          case 'filesystem_list':
            return await this.handleFileList(args);
          case 'terminal_execute':
            return await this.handleTerminalExecute(args);
          case 'memory_store':
            return await this.handleMemoryStore(args);
          case 'memory_retrieve':
            return await this.handleMemoryRetrieve(args);
          case 'memory_search':
            return await this.handleMemorySearch(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) throw error;
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  private async handleFileRead(args: any) {
    const filePath = path.join(this.workspacePath, args.path);
    const content = await fs.readFile(filePath, 'utf-8');
    return {
      content: [{
        type: 'text',
        text: content,
      }],
    };
  }

  private async handleFileWrite(args: any) {
    const filePath = path.join(this.workspacePath, args.path);
    await fs.writeFile(filePath, args.content);
    return {
      content: [{
        type: 'text',
        text: `File written successfully: ${args.path}`,
      }],
    };
  }

  private async handleFileList(args: any) {
    const dirPath = path.join(this.workspacePath, args.path || '.');
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    
    const listing = files.map(file => ({
      name: file.name,
      type: file.isDirectory() ? 'directory' : 'file',
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(listing, null, 2),
      }],
    };
  }

  private async handleTerminalExecute(args: any) {
    const { stdout, stderr } = await execAsync(args.command, {
      cwd: args.cwd || this.workspacePath,
    });

    return {
      content: [{
        type: 'text',
        text: stdout || stderr,
      }],
    };
  }

  private async handleMemoryStore(args: any) {
    const memoryPath = path.join(this.memoryBankPath, `${args.key}.json`);
    const data = {
      value: args.value,
      metadata: args.metadata || {},
      timestamp: new Date().toISOString(),
    };
    
    await fs.mkdir(path.dirname(memoryPath), { recursive: true });
    await fs.writeFile(memoryPath, JSON.stringify(data, null, 2));
    
    return {
      content: [{
        type: 'text',
        text: `Stored data under key: ${args.key}`,
      }],
    };
  }

  private async handleMemoryRetrieve(args: any) {
    const memoryPath = path.join(this.memoryBankPath, `${args.key}.json`);
    
    try {
      const data = await fs.readFile(memoryPath, 'utf-8');
      return {
        content: [{
          type: 'text',
          text: data,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `No data found for key: ${args.key}`,
        }],
      };
    }
  }

  private async handleMemorySearch(args: any) {
    // This is a simplified search - in production, this would use vector similarity
    const files = await fs.readdir(this.memoryBankPath);
    const results = [];
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const content = await fs.readFile(
        path.join(this.memoryBankPath, file),
        'utf-8'
      );
      const data = JSON.parse(content);
      
      // Simple text search - replace with vector search in production
      if (JSON.stringify(data).toLowerCase().includes(args.query.toLowerCase())) {
        results.push({
          key: file.replace('.json', ''),
          data,
        });
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results.slice(0, args.limit || 10), null, 2),
      }],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ClaudeOSaar MCP Server started');
  }
}

// Start the server if this file is executed directly
if (require.main === module) {
  const config = {
    workspacePath: process.env.WORKSPACE_PATH || process.cwd(),
    memoryBankPath: process.env.MEMORY_BANK_PATH || path.join(process.cwd(), '.claude/memory-bank'),
  };
  
  const server = new ClaudeOSaarMCPServer(config);
  server.start().catch(console.error);
}
