#!/bin/bash

# ClaudeOSaar System Health Check Script

echo "🏥 ClaudeOSaar System Health Check"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Service URLs
API_URL="http://localhost:6600/health"
UI_URL="http://localhost:6601"
MCP_URL="http://localhost:6602/health"
QDRANT_URL="http://localhost:6333/collections"

# Check function
check_service() {
    local service_name=$1
    local service_url=$2
    
    echo -n "Checking $service_name... "
    
    if curl -s -f -o /dev/null "$service_url"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Check Docker
echo -n "Checking Docker... "
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    exit 1
fi

# Check Docker Compose
echo -n "Checking Docker Compose... "
if docker-compose version > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    exit 1
fi

# Check services
echo ""
echo "Service Health:"
echo "--------------"

check_service "API Server" "$API_URL"
API_STATUS=$?

check_service "UI Server" "$UI_URL"
UI_STATUS=$?

check_service "MCP Server" "$MCP_URL"
MCP_STATUS=$?

check_service "Qdrant" "$QDRANT_URL"
QDRANT_STATUS=$?

# Check containers
echo ""
echo "Container Status:"
echo "----------------"

for container in postgres redis qdrant; do
    echo -n "Checking $container... "
    if docker ps | grep -q $container; then
        echo -e "${GREEN}✓ RUNNING${NC}"
    else
        echo -e "${RED}✗ NOT RUNNING${NC}"
    fi
done

# Check database connectivity
echo ""
echo "Database Connectivity:"
echo "--------------------"

echo -n "PostgreSQL... "
if docker exec postgres pg_isready > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

echo -n "Redis... "
if docker exec redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

# Check disk space
echo ""
echo "Disk Space:"
echo "----------"
df -h | grep -E "^/dev/" | awk '{print $1 " - " $5 " used"}'

# Check memory usage
echo ""
echo "Memory Usage:"
echo "------------"
free -h | grep -E "^Mem:" | awk '{print "Total: " $2 ", Used: " $3 ", Free: " $4}'

# Check CPU usage
echo ""
echo "CPU Usage:"
echo "---------"
top -bn1 | grep "Cpu(s)" | awk '{print "Usage: " $2 "%"}'

# Summary
echo ""
echo "Summary:"
echo "-------"

if [ $API_STATUS -eq 0 ] && [ $UI_STATUS -eq 0 ] && [ $MCP_STATUS -eq 0 ] && [ $QDRANT_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ All services are healthy${NC}"
    exit 0
else
    echo -e "${RED}✗ Some services are unhealthy${NC}"
    exit 1
fi