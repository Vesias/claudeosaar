#!/bin/bash

# claude-workspace-init.sh - Initialize a new user workspace

if [ $# -ne 4 ]; then
    echo "Usage: $0 <user_id> <workspace_id> <api_key> <tier>"
    exit 1
fi

USER_ID=$1
WORKSPACE_ID=$2
API_KEY=$3
TIER=$4

echo "[=€] Initializing workspace for user: $USER_ID"

# Create workspace directory structure
WORKSPACE_ROOT="/user_mounts/${USER_ID}/${WORKSPACE_ID}"
mkdir -p "${WORKSPACE_ROOT}"/{.claude/{memory-bank,agents,prompts},projects,temp}

# Set resource limits based on tier
case $TIER in
    "free")
        MEMORY="512m"
        CPUS="0.5"
        ;;
    "pro")
        MEMORY="2g"
        CPUS="2"
        ;;
    "enterprise")
        MEMORY="8g"
        CPUS="4"
        ;;
    *)
        echo "Invalid tier: $TIER"
        exit 1
        ;;
esac

# Start workspace container
docker run -d \
    --name "workspace-${WORKSPACE_ID}" \
    --memory="${MEMORY}" \
    --cpus="${CPUS}" \
    --security-opt apparmor=claudeosaar-container-profile \
    -e CLAUDE_API_KEY="${API_KEY}" \
    -e WORKSPACE_ID="${WORKSPACE_ID}" \
    -e USER_ID="${USER_ID}" \
    -v "${WORKSPACE_ROOT}:/workspace" \
    --network claude-net \
    claudeosaar/workspace:latest

echo " Workspace ${WORKSPACE_ID} initialized for user ${USER_ID}"