#!/bin/bash

# ClaudeOSaar shadcn-ui MCP Server Development Script
# This script starts the shadcn-ui MCP server for local development

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

PORT="${SHADCN_MCP_PORT:-6605}"

echo -e "${BLUE}Starting ClaudeOSaar shadcn-ui MCP Server on port ${PORT}...${NC}"

# Kill any existing MCP server instances on the port
echo -e "${YELLOW}Cleaning up existing MCP server processes...${NC}"
lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true

# Build and start the shadcn-ui MCP server using Docker Compose
cd "$PROJECT_ROOT/containers"

# Start with the mcp-plugins profile
echo -e "${GREEN}Building and starting shadcn-ui MCP Server...${NC}"
docker-compose --profile mcp-plugins up -d shadcn-ui-mcp

# Wait for the service to be healthy
echo -e "${BLUE}Waiting for shadcn-ui MCP server to be ready...${NC}"
sleep 5

# Check if the service is running
if docker-compose ps | grep -q "shadcn-ui-mcp.*Up"; then
  echo -e "${GREEN}shadcn-ui MCP Server is running at http://localhost:${PORT}${NC}"
  echo -e "${YELLOW}To stop the server, run: docker-compose --profile mcp-plugins down${NC}"
else
  echo -e "${RED}Failed to start shadcn-ui MCP Server${NC}"
  docker-compose logs shadcn-ui-mcp
  exit 1
fi

echo -e "${BLUE}Available endpoints:${NC}"
echo -e "  - GET /health - Health check"
echo -e "  - POST /getComponent - Get component source code"
echo -e "  - POST /getComponentDemo - Get component demo"
echo -e "  - POST /getInstallScript - Get installation script"
echo -e "  - POST /getFrameworkGuide - Get framework-specific guide"