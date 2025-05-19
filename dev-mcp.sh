#!/bin/bash

# ClaudeOSaar MCP Server Development Script
# This script starts the MCP server for local development

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Read MCP server port from environment or config file
if [ -n "$MCP_SERVER_PORT" ]; then
  PORT="$MCP_SERVER_PORT"
else
  # Try to extract port from config.json
  if [ -f "$PROJECT_ROOT/.claude/mcp-server/config.json" ]; then
    PORT=$(grep -o '"port":[^,}]*' "$PROJECT_ROOT/.claude/mcp-server/config.json" | head -1 | cut -d':' -f2 | tr -d ' ')
  fi
  
  # Default to 6602 if not found
  PORT=${PORT:-6602}
fi

echo -e "${BLUE}Starting ClaudeOSaar MCP Server on port ${PORT}...${NC}"

# Kill any existing MCP server instances
echo -e "${YELLOW}Cleaning up existing MCP server processes...${NC}"
lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true

# Make sure the MCP server directory exists
mkdir -p "$PROJECT_ROOT/.claude/mcp-server"

# Ensure config.json exists
if [ ! -f "$PROJECT_ROOT/.claude/mcp-server/config.json" ]; then
  echo -e "${RED}MCP Server config not found. Creating default config...${NC}"
  cat > "$PROJECT_ROOT/.claude/mcp-server/config.json" << EOF
{
  "port": ${PORT},
  "host": "localhost",
  "tools": [
    {
      "name": "filesystem",
      "enabled": true,
      "config": {
        "allowedDirectories": ["./"]
      }
    },
    {
      "name": "terminal",
      "enabled": true,
      "config": {
        "allowedCommands": ["*"]
      }
    },
    {
      "name": "memory-bank",
      "enabled": true,
      "config": {
        "storagePath": "./ai_docs/memory-bank"
      }
    }
  ],
  "security": {
    "allowLocalHostOnly": true,
    "requireAuthentication": false
  }
}
EOF
fi

# Install dependencies if needed
if [ ! -d "$PROJECT_ROOT/.claude/mcp-server/node_modules" ]; then
  echo -e "${YELLOW}Installing MCP server dependencies...${NC}"
  cd "$PROJECT_ROOT/.claude/mcp-server"
  npm install
  cd "$PROJECT_ROOT"
fi

if [ ! -d "$PROJECT_ROOT/.claude/mcp-server/mock-server/node_modules" ]; then
  echo -e "${YELLOW}Installing mock server dependencies...${NC}"
  cd "$PROJECT_ROOT/.claude/mcp-server/mock-server"
  npm install express
  cd "$PROJECT_ROOT"
fi

# Start the MCP Server
echo -e "${GREEN}Starting MCP Server...${NC}"
cd "$PROJECT_ROOT"

# Use our local mock server instead of npm package
MCP_SERVER_PORT=${PORT} node "$PROJECT_ROOT/.claude/mcp-server/mock-server/server.js" &

MCP_PID=$!

echo -e "${GREEN}MCP Server running at http://localhost:${PORT}${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"

# Handle cleanup on exit
function cleanup() {
  echo -e "${YELLOW}Stopping MCP Server...${NC}"
  kill $MCP_PID 2>/dev/null || true
  exit 0
}

trap cleanup INT TERM

# Keep the script running until it's killed
wait $MCP_PID