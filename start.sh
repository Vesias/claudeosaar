#!/bin/bash

echo "[🛠️] Starting ClaudeOSaar environment..."

# Check prerequisites
for cmd in docker docker-compose npm; do
    if ! command -v $cmd &> /dev/null; then
        echo "❌ $cmd is required but not installed."
        exit 1
    fi
done

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Validate required env vars
REQUIRED_VARS="CLAUDE_API_KEY STRIPE_SECRET_KEY DATABASE_URL"
for var in $REQUIRED_VARS; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        exit 1
    fi
done

# Create necessary directories
mkdir -p user_mounts volumes/postgres volumes/qdrant volumes/redis volumes/grafana

# Function to wait for service
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=0
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -E "^(200|302)$" > /dev/null; then
            echo "✅ $service_name is ready"
            return 0
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    echo "❌ Timeout waiting for $service_name"
    return 1
}

# Clean up existing processes
echo "Cleaning up existing processes..."
kill $(lsof -t -i:6600) 2>/dev/null || true
kill $(lsof -t -i:6601) 2>/dev/null || true
kill $(lsof -t -i:6602) 2>/dev/null || true
pkill -f "tsx watch src/api/server.ts" || true
pkill -f "next dev -p" || true
sleep 3

# Start databases first
echo "🗄️ Starting databases..."
docker-compose -f containers/docker-compose.yaml up -d postgres redis qdrant

# Wait for databases to be ready
sleep 10

# Start MCP server
echo "🤖 Starting MCP server..."
docker-compose -f containers/docker-compose.yaml up -d mcp-server

# Start API server
echo "🔧 Starting API server..."
npm run dev &
API_PID=$!

# Wait for services to be ready
wait_for_service "API" "http://localhost:6600/health"
wait_for_service "MCP Server" "http://localhost:6602/health"

# Start UI server
echo "🎨 Starting UI server..."
npm run dev:ui &
UI_PID=$!

# Wait for UI to be ready
wait_for_service "UI" "http://localhost:6601"

echo ""
echo "✅ ClaudeOSaar is running!"
echo ""
echo "🌐 Service URLs:"
echo "   UI:          http://localhost:6601"
echo "   API:         http://localhost:6600"
echo "   MCP Server:  http://localhost:6602"
echo "   Qdrant:      http://localhost:6333"
echo ""
echo "📚 API Documentation: http://localhost:6600/docs"
echo "🔧 To stop all services: ./stop.sh"
echo ""
echo "Happy coding with Claude! 🚀"

# Handle cleanup on exit
function cleanup() {
  echo ""
  echo "Stopping ClaudeOSaar..."
  kill $API_PID 2>/dev/null || true
  kill $UI_PID 2>/dev/null || true
  docker-compose -f containers/docker-compose.yaml down
  exit 0
}

trap cleanup INT TERM

# Wait for processes
wait