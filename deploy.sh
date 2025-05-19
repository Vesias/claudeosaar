#!/bin/bash

echo "🚀 Deploying ClaudeOSaar MVP..."

# Environment check
if [ "$1" != "staging" ] && [ "$1" != "production" ]; then
    echo "Usage: ./deploy.sh [staging|production]"
    exit 1
fi

ENVIRONMENT=$1
echo "Deploying to: $ENVIRONMENT"

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
else
    echo "❌ Environment file .env.$ENVIRONMENT not found"
    exit 1
fi

# Run tests
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Aborting deployment."
    exit 1
fi

# Build containers
echo "Building containers..."
docker-compose -f containers/docker-compose.yaml build

# Run security scan
echo "Running security scan..."
docker scan claudeosaar/workspace:latest || true

# Database migrations
echo "Running database migrations..."
docker-compose exec api python manage.py migrate

# Tag images
echo "Tagging images..."
docker tag claudeosaar/api:latest claudeosaar/api:$ENVIRONMENT
docker tag claudeosaar/ui:latest claudeosaar/ui:$ENVIRONMENT
docker tag claudeosaar/mcp-server:latest claudeosaar/mcp-server:$ENVIRONMENT

# Push to registry (if using remote registry)
if [ -n "$DOCKER_REGISTRY" ]; then
    echo "Pushing to registry..."
    docker push $DOCKER_REGISTRY/claudeosaar/api:$ENVIRONMENT
    docker push $DOCKER_REGISTRY/claudeosaar/ui:$ENVIRONMENT
    docker push $DOCKER_REGISTRY/claudeosaar/mcp-server:$ENVIRONMENT
fi

# Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Deploying to production..."
    
    # Health check before switching
    HEALTH_CHECK_URL="https://api.claudeosaar.saarland/health"
    if curl -f $HEALTH_CHECK_URL; then
        echo "✅ Health check passed"
    else
        echo "❌ Health check failed"
        exit 1
    fi
    
    # Blue-green deployment
    docker-compose -f containers/docker-compose.prod.yaml up -d --scale api=2
    sleep 30
    docker-compose -f containers/docker-compose.prod.yaml up -d --remove-orphans
    
    # Clear CDN cache
    echo "Clearing CDN cache..."
    # Add CDN cache clear command here
    
else
    echo "Deploying to staging..."
    docker-compose -f containers/docker-compose.staging.yaml up -d
fi

# Post-deployment checks
echo "Running post-deployment checks..."
sleep 10

# Health check
if [ "$ENVIRONMENT" = "production" ]; then
    HEALTH_URL="https://api.claudeosaar.saarland/health"
else
    HEALTH_URL="https://staging-api.claudeosaar.saarland/health"
fi

if curl -f $HEALTH_URL; then
    echo "✅ Deployment successful!"
    echo "   UI: https://app.claudeosaar.saarland"
    echo "   API: https://api.claudeosaar.saarland"
else
    echo "❌ Deployment health check failed"
    exit 1
fi

# Send notification
echo "Sending deployment notification..."
curl -X POST $SLACK_WEBHOOK_URL \
    -H 'Content-type: application/json' \
    -d "{\"text\":\"ClaudeOSaar deployed to $ENVIRONMENT successfully! 🚀\"}"

echo "✅ Deployment complete!"