const express = require('express');
const app = express();

// Mock MCP Server for development
class MockMCPServer {
    constructor() {
        this.tools = {
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
    }
    
    handleToolRequest(req, res) {
        const { tool } = req.params;
        const { params } = req.body;
        
        console.log(`Mock MCP: Handling tool request for ${tool}`, params);
        
        // Mock responses
        switch(tool) {
            case 'executeCommand':
                res.json({ output: `Mock output for: ${params.command}` });
                break;
            case 'readFile':
                res.json({ content: `Mock content of ${params.path}` });
                break;
            case 'writeFile':
                res.json({ success: true, message: `Mock: Wrote to ${params.path}` });
                break;
            case 'searchMemoryBank':
                res.json({ 
                    results: [
                        { file: 'mock-memory.md', content: `Mock result for query: ${params.query}`, relevance: 0.9 }
                    ]
                });
                break;
            default:
                res.status(404).json({ error: 'Tool not found' });
        }
    }
    
    router() {
        const router = express.Router();
        router.post('/tools/:tool', (req, res) => this.handleToolRequest(req, res));
        router.get('/tools', (req, res) => res.json(this.tools));
        router.get('/health', (req, res) => res.json({ status: 'healthy', mode: 'mock' }));
        return router;
    }
}

const mockMCP = new MockMCPServer();

// Middleware
app.use(express.json());

// MCP routes
app.use('/mcp', mockMCP.router());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', mode: 'mock' });
});

const PORT = process.env.MCP_SERVER_PORT || 6602;
app.listen(PORT, () => {
    console.log(`Mock MCP Server running on port ${PORT}`);
    console.log('This is a mock server for development purposes');
});