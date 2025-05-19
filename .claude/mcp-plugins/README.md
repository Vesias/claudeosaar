# MCP Plugins for ClaudeOSaar

This directory contains MCP (Model Context Protocol) plugins for ClaudeOSaar.

## Current Plugins

### shadcn-ui

A MCP plugin that provides shadcn/ui component integration with Claude. It exposes the following endpoints:

- `GET /health` - Health check endpoint
- `POST /getComponent` - Get component source code
- `POST /getComponentDemo` - Get component demo
- `POST /getInstallScript` - Get installation script
- `POST /getFrameworkGuide` - Get framework-specific guide

To start the shadcn-ui MCP server:

```bash
./dev-shadcn-mcp.sh
```

The server runs on port 6605.

## Notes

### osp-marketing

The "osp-marketing" tool reference is not currently configured. If you want to add this tool, you would need to:

1. Create a new directory in this folder: `.claude/mcp-plugins/osp-marketing`
2. Implement the necessary server code and Dockerfile
3. Add configuration to the MCP server config file
4. Update the docker-compose.yaml file to include the new service

To see an example implementation, refer to the shadcn-ui plugin setup.