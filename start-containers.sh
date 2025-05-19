#!/bin/bash

# ClaudeOSaar Local Development Docker Script
# This script starts all necessary containers for local development

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    echo -e "${YELLOW}You can use ./get-docker.sh to install Docker on Linux.${NC}"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

echo -e "${BLUE}ClaudeOSaar Local Development Environment${NC}"
echo -e "${YELLOW}Starting containers in development mode...${NC}"

# Make sure we have .env file
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
    if [ -f "$PROJECT_ROOT/.env.example" ]; then
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
        echo -e "${GREEN}Created .env file. Please edit it to add your API keys.${NC}"
    else
        echo -e "${RED}No .env.example file found. Please create a .env file manually.${NC}"
        exit 1
    fi
fi

# Load environment variables
set -a
source "$PROJECT_ROOT/.env"
set +a

# Create required directories
mkdir -p "$PROJECT_ROOT/containers/ssl"
mkdir -p "$PROJECT_ROOT/containers/monitoring"
mkdir -p "$PROJECT_ROOT/.claude/mcp-server"

# Check for Prometheus config
if [ ! -f "$PROJECT_ROOT/containers/monitoring/prometheus.yml" ]; then
    echo -e "${YELLOW}Creating Prometheus configuration...${NC}"
    cat > "$PROJECT_ROOT/containers/monitoring/prometheus.yml" << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'claudeosaar'
    static_configs:
      - targets: 
          - 'api:8000'
          - 'mcp-gateway:3000'
          - 'a2a-coordinator:8080'
          - 'rag-system:8000'
          - 'embedding-service:8000'
          - 'llama-server:8000'
EOF
fi

# Generate self-signed certificates for development
if [ ! -f "$PROJECT_ROOT/containers/ssl/claudeosaar.crt" ]; then
    echo -e "${YELLOW}Generating self-signed certificates for development...${NC}"
    mkdir -p "$PROJECT_ROOT/containers/ssl"
    cd "$PROJECT_ROOT/containers/ssl"
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout claudeosaar.key -out claudeosaar.crt \
        -subj "/C=DE/ST=Berlin/L=Berlin/O=ClaudeOSaar Dev/CN=localhost"
    
    echo -e "${GREEN}Self-signed certificates generated.${NC}"
    cd "$PROJECT_ROOT"
fi

# Start containers using docker-compose
echo -e "${BLUE}Starting ClaudeOSaar containers...${NC}"
cd "$PROJECT_ROOT"

# First, let's check if this is the first run or if we need to rebuild
if [ ! -d "$PROJECT_ROOT/node_modules" ] || [ "$1" == "--rebuild" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    
    echo -e "${YELLOW}Building Docker images...${NC}"
    npm run docker:build
fi

# Start required services
echo -e "${YELLOW}Starting core services...${NC}"
npm run docker:up

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 5

echo -e "${GREEN}ClaudeOSaar local development environment is running!${NC}"
echo -e "${GREEN}Services available at:${NC}"
echo -e "${BLUE}- API Server: ${NC}http://localhost:6600"
echo -e "${BLUE}- Frontend: ${NC}http://localhost:6601"
echo -e "${BLUE}- MCP Gateway: ${NC}http://localhost:6602"
echo -e "${BLUE}- Grafana: ${NC}http://localhost:6603"
echo -e "${BLUE}- A2A Coordinator: ${NC}http://localhost:6604"
echo -e "${YELLOW}For development, run:${NC}"
echo -e "${BLUE}- API + UI + MCP: ${NC}npm run dev:all"
echo -e "${BLUE}- Stop containers: ${NC}npm run docker:down"

# Clean exit setup
echo -e "${YELLOW}Press Ctrl+C to stop watching logs (containers will continue running)${NC}"
docker-compose -f "$PROJECT_ROOT/containers/docker-compose.yaml" logs -f
