#!/bin/bash

# Initialize ClaudeOSaar Docker Network
# Ensures the required network exists before starting containers

NETWORK_NAME="claude-net"
SUBNET="172.25.0.0/16"

# Check if network exists
if ! docker network inspect $NETWORK_NAME >/dev/null 2>&1; then
    echo "Creating Docker network: $NETWORK_NAME"
    docker network create \
        --driver bridge \
        --subnet $SUBNET \
        --opt com.docker.network.bridge.name=br-claudeosaar \
        $NETWORK_NAME
else
    echo "Network $NETWORK_NAME already exists"
fi

# Verify network
docker network inspect $NETWORK_NAME --format='Name: {{.Name}} | Subnet: {{range .IPAM.Config}}{{.Subnet}}{{end}}'