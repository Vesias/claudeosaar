#!/bin/bash

# ClaudeOSaar Container Orchestration Startup Script

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check for required environment variables
check_env() {
    local required_vars=(
        "ANTHROPIC_API_KEY"
        "VECTOR_DB_PASSWORD"
        "API_DB_PASSWORD"
        "JWT_SECRET"
        "GRAFANA_PASSWORD"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    log_info "All required environment variables are set"
}

# Load environment from .env file if present
if [ -f ".env" ]; then
    log_info "Loading environment from .env file"
    export $(cat .env | grep -v '^#' | xargs)
else
    log_warn ".env file not found, using existing environment variables"
fi

# Check environment
check_env

# Create necessary directories
log_info "Creating necessary directories..."
mkdir -p ../ai_docs/memory-bank
mkdir -p ../.claude/mcp-server
mkdir -p ../projects
mkdir -p ./monitoring

# Generate Prometheus configuration if not exists
if [ ! -f "./monitoring/prometheus.yml" ]; then
    log_info "Creating Prometheus configuration..."
    cat > ./monitoring/prometheus.yml << EOF
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

# Build custom images
log_info "Building custom Docker images..."
docker-compose build

# Pull external images
log_info "Pulling external Docker images..."
docker-compose pull

# Start services in order
log_info "Starting core infrastructure services..."
docker-compose up -d cache api-db vector-db

# Wait for databases to be ready
log_info "Waiting for databases to initialize..."
sleep 10

# Start API and MCP services
log_info "Starting API and MCP services..."
docker-compose up -d api mcp-gateway memory-bank

# Wait for API to be ready
log_info "Waiting for API to be ready..."
sleep 5

# Start AI services
log_info "Starting AI services..."
docker-compose up -d embedding-service llama-server rag-system

# Start agent services
log_info "Starting agent services..."
docker-compose up -d agent-registry a2a-coordinator

# Start Claude Code
log_info "Starting Claude Code..."
docker-compose up -d claude-code

# Start frontend
log_info "Starting frontend..."
docker-compose up -d frontend

# Start monitoring
log_info "Starting monitoring services..."
docker-compose up -d prometheus grafana

# Show status
log_info "All services started. Checking status..."
docker-compose ps

# Display access URLs
log_info "ClaudeOSaar is now running!"
log_info "Access the services at:"
log_info "  - Frontend: http://localhost:3001"
log_info "  - API: http://localhost:8000"
log_info "  - A2A Coordinator: http://localhost:8080"
log_info "  - Grafana: http://localhost:3002 (admin/${GRAFANA_PASSWORD})"
log_info ""
log_info "To access Claude Code CLI:"
log_info "  docker exec -it claudeosaar_claude_code claude"
log_info ""
log_info "To view logs:"
log_info "  docker-compose logs -f [service-name]"
log_info ""
log_info "To stop all services:"
log_info "  docker-compose down"