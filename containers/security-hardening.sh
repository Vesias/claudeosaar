#!/bin/bash
# ClaudeOSaar Security Hardening Script
# This script implements security hardening measures for ClaudeOSaar v2.2.0

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "ClaudeOSaar Security Hardening v2.2.0"
echo "======================================"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
  echo "⚠️  Warning: Some security measures require root privileges."
  echo "   Please consider running this script with sudo."
  echo ""
  sleep 2
fi

# Function to check if a package is installed
check_package() {
  if command -v $1 &> /dev/null; then
    echo "✅ $1 is installed"
    return 0
  else
    echo "❌ $1 is not installed"
    return 1
  fi
}

# Function to ask for confirmation
confirm() {
  read -p "$1 [y/N] " response
  case "$response" in
    [yY][eE][sS]|[yY]) 
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

echo "1. Checking required packages..."
echo "-------------------------------"

MISSING_PACKAGES=""

for pkg in docker docker-compose openssl jq curl redis-cli npm node; do
  if ! check_package $pkg; then
    MISSING_PACKAGES="$MISSING_PACKAGES $pkg"
  fi
done

if [ -n "$MISSING_PACKAGES" ]; then
  echo ""
  echo "⚠️  Missing packages:$MISSING_PACKAGES"
  echo "   Please install them before continuing."
  
  if confirm "Do you want to attempt to install the missing packages?"; then
    if command -v apt-get &> /dev/null; then
      sudo apt-get update
      sudo apt-get install -y $MISSING_PACKAGES
    elif command -v dnf &> /dev/null; then
      sudo dnf install -y $MISSING_PACKAGES
    else
      echo "❌ Unsupported package manager. Please install the packages manually."
      exit 1
    fi
  else
    echo "Exiting..."
    exit 1
  fi
fi

echo ""
echo "2. Generating SSL certificates..."
echo "-------------------------------"

if [ ! -f "$SCRIPT_DIR/ssl/certs/claudeosaar.crt" ]; then
  echo "SSL certificates not found, generating..."
  mkdir -p "$SCRIPT_DIR/ssl"
  bash "$SCRIPT_DIR/ssl/generate-certs.sh"
else
  echo "✅ SSL certificates already exist"
  
  if confirm "Do you want to regenerate the SSL certificates?"; then
    bash "$SCRIPT_DIR/ssl/generate-certs.sh"
  fi
fi

echo ""
echo "3. Setting up AppArmor profiles..."
echo "-------------------------------"

if command -v apparmor_parser &> /dev/null; then
  echo "AppArmor is installed"
  
  if confirm "Do you want to set up AppArmor for ClaudeOSaar containers?"; then
    sudo bash "$SCRIPT_DIR/apparmor/setup-apparmor.sh"
  else
    echo "Skipping AppArmor setup"
  fi
else
  echo "⚠️  AppArmor is not installed. Skipping AppArmor setup."
fi

echo ""
echo "4. Configuring Redis with key expiration..."
echo "-------------------------------"

if docker ps | grep -q claudeosaar_cache; then
  echo "Redis container is running, updating configuration..."
  
  # Execute Redis commands to configure key expiration
  docker exec claudeosaar_cache redis-cli CONFIG SET maxmemory 256mb
  docker exec claudeosaar_cache redis-cli CONFIG SET maxmemory-policy volatile-lru
  docker exec claudeosaar_cache redis-cli CONFIG SET save "900 1 300 10 60 10000"
  
  # Set session expiration policy (24 hours)
  docker exec claudeosaar_cache redis-cli CONFIG SET session-expiry 86400
  
  echo "✅ Redis configured successfully"
else
  echo "⚠️  Redis container not running. Please start the containers first."
fi

echo ""
echo "5. Installing NPM dependencies for security features..."
echo "-------------------------------"

# Check if package.json exists and contains required dependencies
if [ -f "$PROJECT_DIR/package.json" ]; then
  MISSING_DEPS=""
  
  for dep in helmet cookie-session uuid; do
    if ! grep -q "\"$dep\"" "$PROJECT_DIR/package.json"; then
      MISSING_DEPS="$MISSING_DEPS $dep"
    fi
  done
  
  if [ -n "$MISSING_DEPS" ]; then
    echo "Installing missing dependencies:$MISSING_DEPS"
    cd "$PROJECT_DIR"
    npm install --save $MISSING_DEPS
  else
    echo "✅ All required NPM dependencies are installed"
  fi
else
  echo "❌ package.json not found. Cannot install dependencies."
fi

echo ""
echo "6. Applying security configuration to .env file..."
echo "-------------------------------"

ENV_FILE="$PROJECT_DIR/.env"
ENV_EXAMPLE="$PROJECT_DIR/.env.example"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env file not found. Creating from example if available."
  
  if [ -f "$ENV_EXAMPLE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
  else
    touch "$ENV_FILE"
  fi
fi

# Add or update security-related env variables
update_env() {
  if grep -q "^$1=" "$ENV_FILE"; then
    # Replace existing value
    sed -i "s|^$1=.*|$1=$2|g" "$ENV_FILE"
  else
    # Add new variable
    echo "$1=$2" >> "$ENV_FILE"
  fi
}

# Security settings
update_env "USE_SSL" "true"
update_env "SSL_KEYFILE" "/etc/ssl/private/claudeosaar.key"
update_env "SSL_CERTFILE" "/etc/ssl/certs/claudeosaar.crt"
update_env "CSRF_SECRET" "$(openssl rand -base64 32)"
update_env "COOKIE_SECRET" "$(openssl rand -base64 32)"
update_env "SESSION_EXPIRY" "86400"
update_env "ENABLE_HSTS" "true"
update_env "HSTS_MAX_AGE" "31536000"
update_env "REDIS_PASSWORD" "$(openssl rand -base64 16)"

echo "✅ Environment variables updated"

echo ""
echo "7. Restarting services to apply changes..."
echo "-------------------------------"

if confirm "Do you want to restart the Docker containers to apply the changes?"; then
  cd "$SCRIPT_DIR"
  docker-compose down
  docker-compose up -d
  echo "✅ Services restarted successfully"
else
  echo "⚠️  Changes will be applied next time you start the containers"
fi

echo ""
echo "Security hardening completed! 🔒"
echo "Please review the following:"
echo ""
echo "1. Make sure ports 80 and 443 are properly forwarded if using a reverse proxy"
echo "2. Consider setting up a real SSL certificate using Let's Encrypt"
echo "3. Review the AppArmor profile and adjust as needed"
echo "4. Set up proper network segmentation and firewall rules"
echo "5. Consider implementing regular security audits"
echo ""
echo "For more information, see the security documentation."