#!/bin/bash

# Simple script to install Docker and Docker Compose on Linux

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}ClaudeOSaar Docker Installer${NC}"
echo -e "${YELLOW}This script will install Docker and Docker Compose on your system.${NC}"
echo -e "${YELLOW}Supported distributions: Ubuntu, Debian, Fedora, CentOS, RHEL${NC}"
echo ""

# Check if script is run as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run this script as root or with sudo.${NC}"
  exit 1
fi

# Detect Linux distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo -e "${RED}Cannot detect Linux distribution. Please install Docker manually.${NC}"
    exit 1
fi

echo -e "${BLUE}Detected OS: ${OS} ${VER}${NC}"

# Install Docker based on distribution
case "$OS" in
    "Ubuntu" | "Debian GNU/Linux")
        echo -e "${YELLOW}Installing Docker on ${OS}...${NC}"
        apt-get update
        apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
        
        # Add Docker's official GPG key
        mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/$(echo $ID | tr '[:upper:]' '[:lower:]')/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        
        # Set up the repository
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$(echo $ID | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Install Docker Engine
        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        ;;
        
    "Fedora" | "CentOS Linux" | "Red Hat Enterprise Linux")
        echo -e "${YELLOW}Installing Docker on ${OS}...${NC}"
        dnf -y install dnf-plugins-core
        dnf config-manager --add-repo https://download.docker.com/linux/$(echo $ID | tr '[:upper:]' '[:lower:]')/docker-ce.repo
        dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        ;;
        
    *)
        echo -e "${RED}Unsupported distribution: ${OS}. Please install Docker manually.${NC}"
        exit 1
        ;;
esac

# Start and enable Docker service
systemctl start docker
systemctl enable docker

# Install Docker Compose
echo -e "${YELLOW}Installing Docker Compose...${NC}"
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Add current user to docker group
if [ "$SUDO_USER" ]; then
    echo -e "${YELLOW}Adding user ${SUDO_USER} to docker group...${NC}"
    usermod -aG docker $SUDO_USER
    echo -e "${YELLOW}You may need to log out and log back in for this to take effect.${NC}"
fi

# Test Docker installation
echo -e "${YELLOW}Testing Docker installation...${NC}"
docker --version
docker compose version

echo -e "${GREEN}Docker and Docker Compose have been installed successfully!${NC}"
echo -e "${YELLOW}You may need to log out and log back in for user group changes to take effect.${NC}"
