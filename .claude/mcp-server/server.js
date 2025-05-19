const express = require('express');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = util.promisify(exec);
const app = express();

// MCP Server implementation
class MCPServer {
    constructor() {
        this.tools = {};
        this.handlers = new Map();
    }
    
    registerTool(name, config) {
        this.tools[name] = config;
    }
    
    on(toolName, handler) {
        this.handlers.set(toolName, handler);
    }
    
    async handleToolRequest(req, res) {
        const { tool, params } = req.body;
        const handler = this.handlers.get(tool);
        
        if (!handler) {
            return res.status(404).json({ error: 'Tool not found' });
        }
        
        try {
            const result = await handler(params);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    handler() {
        const router = express.Router();
        router.post('/tools/:tool', (req, res) => this.handleToolRequest(req, res));
        router.get('/tools', (req, res) => res.json(this.tools));
        return router;
    }
}

const mcp = new MCPServer();

// Tool definitions
const TOOLS = {
    executeCommand: {
        description: "Execute a command in the workspace",
        parameters: {
            command: { type: "string", required: true },
            workspaceId: { type: "string", required: true }
        }
    },
    readFile: {
        description: "Read a file from the workspace",
        parameters: {
            path: { type: "string", required: true },
            workspaceId: { type: "string", required: true }
        }
    },
    writeFile: {
        description: "Write content to a file in the workspace",
        parameters: {
            path: { type: "string", required: true },
            content: { type: "string", required: true },
            workspaceId: { type: "string", required: true }
        }
    },
    searchMemoryBank: {
        description: "Search the memory bank for context",
        parameters: {
            query: { type: "string", required: true },
            workspaceId: { type: "string", required: true }
        }
    }
};

// Register tools
Object.entries(TOOLS).forEach(([name, config]) => {
    mcp.registerTool(name, config);
});

// Tool handlers
mcp.on('executeCommand', async ({ command, workspaceId }) => {
    const workspacePath = `/user_mounts/${workspaceId}`;
    const { stdout, stderr } = await execAsync(command, { cwd: workspacePath });
    return { output: stdout || stderr };
});

mcp.on('readFile', async ({ path: filePath, workspaceId }) => {
    const fullPath = `/user_mounts/${workspaceId}/${filePath}`;
    const content = await fs.readFile(fullPath, 'utf-8');
    return { content };
});

mcp.on('writeFile', async ({ path: filePath, content, workspaceId }) => {
    const fullPath = `/user_mounts/${workspaceId}/${filePath}`;
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
    return { success: true };
});

mcp.on('searchMemoryBank', async ({ query, workspaceId }) => {
    // Simplified memory bank search - in production, use vector DB
    const memoryPath = `/user_mounts/${workspaceId}/.claude/memory-bank`;
    const files = await fs.readdir(memoryPath).catch(() => []);
    
    const results = [];
    for (const file of files) {
        const content = await fs.readFile(`${memoryPath}/${file}`, 'utf-8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
            results.push({ file, content, relevance: 0.8 });
        }
    }
    
    return { results };
});

// Express middleware
app.use(express.json());
app.use('/mcp', mcp.handler());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

const PORT = process.env.MCP_SERVER_PORT || 6602;
app.listen(PORT, () => {
    console.log(`MCP Server running on port ${PORT}`);
});