#!/bin/bash

# Install AppArmor profile for ClaudeOSaar containers
# This script must be run with sudo privileges

set -e

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo privileges"
  exit 1
fi

# Ensure AppArmor is installed
if ! command -v apparmor_parser &> /dev/null; then
  echo "AppArmor is not installed. Installing..."
  apt-get update
  apt-get install -y apparmor apparmor-utils
fi

# Check if AppArmor is enabled
if ! grep -q "apparmor=1" /proc/cmdline && ! grep -q "security=apparmor" /proc/cmdline; then
  echo "WARNING: AppArmor does not appear to be enabled in the kernel."
  echo "Please ensure it's enabled in your bootloader configuration."
  echo "Continuing anyway..."
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if profile exists
PROFILE_PATH="$SCRIPT_DIR/claudeosaar-container-profile"
if [ ! -f "$PROFILE_PATH" ]; then
  echo "ERROR: Profile not found at $PROFILE_PATH"
  exit 1
fi

# Copy profile to AppArmor directory
echo "Installing AppArmor profile..."
cp "$PROFILE_PATH" /etc/apparmor.d/containers.d/

# Load the profile
echo "Loading AppArmor profile..."
apparmor_parser -r -W /etc/apparmor.d/containers.d/claudeosaar-container-profile

# Verify profile is loaded
if apparmor_status | grep -q "claudeosaar-container-profile"; then
  echo "✅ AppArmor profile successfully loaded"
else
  echo "⚠️  Profile not showing in apparmor_status output. Please check for errors."
fi

echo "Complete! This profile will be applied to containers with:"
echo "  security_opt:"
echo "    - apparmor=claudeosaar-container-profile"
echo ""
echo "Restart your containers to apply the profile."