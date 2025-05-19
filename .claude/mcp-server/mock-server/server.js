#!/usr/bin/env node

/**
 * Simple MCP Server Mock for ClaudeOSaar
 * This provides a basic mock of the MCP server for local development
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = process.argv[2] || path.join(__dirname, '..', 'config.json');
let config;

try {
  const configContent = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configContent);
  console.log('Loaded configuration from:', configPath);
} catch (error) {
  console.error('Failed to load configuration:', error.message);
  config = {
    port: 6602,
    host: 'localhost',
    tools: [
      {
        name: 'filesystem',
        enabled: true,
        config: {
          allowedDirectories: ['./']
        }
      }
    ],
    security: {
      allowLocalHostOnly: true,
      requireAuthentication: false
    }
  };
  console.log('Using default configuration');
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  // List available tools
  if (req.method === 'GET' && req.url === '/tools') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      tools: config.tools.filter(tool => tool.enabled).map(tool => tool.name) 
    }));
    return;
  }
  
  // Handle tool requests
  if (req.method === 'POST' && req.url === '/execute') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const { tool, params } = requestData;
        
        console.log(`Executing tool: ${tool}`, params);
        
        // Mock responses for different tools
        let response;
        
        switch (tool) {
          case 'filesystem':
            response = handleFilesystemTool(params);
            break;
          case 'terminal':
            response = { output: 'Command executed successfully', exitCode: 0 };
            break;
          case 'memory-bank':
            response = { success: true, data: { entries: [] } };
            break;
          case 'context7':
            response = { success: true, data: 'Documentation content would appear here' };
            break;
          case 'sequentialthinking':
            response = { success: true, thought: params.thought, thoughtNumber: params.thoughtNumber };
            break;
          case 'qdrant-store':
            response = { success: true, id: 'doc-' + Math.random().toString(36).substr(2, 9) };
            break;
          case 'qdrant-find':
            response = { success: true, results: [] };
            break;
          case 'web_search':
          case 'web_fetch':
            response = { success: true, results: [] };
            break;
          default:
            response = { error: `Tool '${tool}' not found or not enabled` };
            break;
        }
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      } catch (error) {
        console.error('Error processing request:', error);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid request format' }));
      }
    });
    
    return;
  }
  
  // Default 404 handler
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Basic handler for filesystem tools
function handleFilesystemTool(params) {
  switch (params.action) {
    case 'list':
      return { 
        items: [
          { name: 'file1.txt', type: 'file' },
          { name: 'file2.txt', type: 'file' },
          { name: 'directory1', type: 'directory' }
        ]
      };
    case 'read':
      return { content: 'This is the content of ' + params.path };
    case 'write':
      return { success: true };
    default:
      return { error: `Action '${params.action}' not supported` };
  }
}

// Start server
server.listen(config.port, config.host, () => {
  console.log(`MCP Server mock running at http://${config.host}:${config.port}`);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('Shutting down MCP Server mock');
  server.close(() => {
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
