#!/bin/bash

echo "🛑 Stopping ClaudeOSaar services..."

# Stop Node.js processes
kill $(lsof -t -i:6600) 2>/dev/null || true
kill $(lsof -t -i:6601) 2>/dev/null || true
kill $(lsof -t -i:6602) 2>/dev/null || true

# Stop processes by pattern
pkill -f "tsx watch src/api/server.ts" || true
pkill -f "next dev -p" || true
pkill -f "node server.js" || true

# Stop Docker containers
docker-compose -f containers/docker-compose.yaml down

echo "✅ All services stopped"