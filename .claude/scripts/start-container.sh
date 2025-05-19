#!/bin/bash

echo "[🛠️] Starting ClaudeOSaar container environment..."

# Check prerequisites
for cmd in docker docker-compose; do
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
mkdir -p user_mounts volumes/postgres volumes/qdrant

# Start containers
docker-compose -f containers/docker-compose.yaml up -d

echo "✅ ClaudeOSaar started at:"
echo "   UI: http://localhost:6601"
echo "   API: http://localhost:6600"
echo "   MCP: http://localhost:6602"