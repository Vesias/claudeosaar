#!/bin/bash

# ClaudeOSaar Container Start Script
# Usage: ./start-container.sh <user_id> <workspace_id> <api_key> <tier>

USER_ID=$1
WORKSPACE_ID=$2
API_KEY=$3
TIER=$4

# Validate inputs
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <user_id> <workspace_id> <api_key> <tier>"
    exit 1
fi

# Create user workspace directory
mkdir -p /user_mounts/${USER_ID}/${WORKSPACE_ID}/.claude

# Copy template structure
cp -r /app/.claude/* /user_mounts/${USER_ID}/${WORKSPACE_ID}/.claude/

# Set environment variables
export ANTHROPIC_API_KEY="$API_KEY"
export WORKSPACE_ID="$WORKSPACE_ID"
export USER_ID="$USER_ID"
export TIER="$TIER"

# Apply resource limits based on tier
case "$TIER" in
    "free")
        MEMORY="512m"
        CPUS="0.5"
        STORAGE="5g"
        ;;
    "pro")
        MEMORY="2g"
        CPUS="2"
        STORAGE="50g"
        ;;
    "enterprise")
        MEMORY="8g"
        CPUS="4"
        STORAGE="100g"
        ;;
    *)
        echo "Invalid tier: $TIER"
        exit 1
        ;;
esac

# Start container with resource limits
docker run -d \
    --name "claudeos_${WORKSPACE_ID}" \
    --memory="$MEMORY" \
    --cpus="$CPUS" \
    --storage-opt size="$STORAGE" \
    -e ANTHROPIC_API_KEY \
    -e WORKSPACE_ID \
    -e USER_ID \
    -e TIER \
    -v "/user_mounts/${USER_ID}/${WORKSPACE_ID}:/workspace" \
    -p 0:22 \
    --network claude-net \
    --security-opt apparmor=claudeosaar-container-profile \
    claudeosaar/claude-code:latest

echo "Container started: claudeos_${WORKSPACE_ID}"
echo "SSH port: $(docker port claudeos_${WORKSPACE_ID} 22 | cut -d: -f2)"
