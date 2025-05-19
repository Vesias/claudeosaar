#!/bin/bash

# Install AppArmor profile for ClaudeOSaar containers

if ! command -v apparmor_parser &> /dev/null; then
    echo "AppArmor is not installed. Please install it first."
    exit 1
fi

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Load the profile
apparmor_parser -r claudeosaar-container-profile

# Check if profile loaded successfully
if apparmor_status | grep -q claudeosaar-container-profile; then
    echo "✅ AppArmor profile loaded successfully"
else
    echo "❌ Failed to load AppArmor profile"
    exit 1
fi