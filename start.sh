#!/bin/bash

# Start ClaudeOSaar API Server and UI

# Kill existing processes first
echo "Cleaning up existing processes..."

# Kill processes using the specific ports
kill $(lsof -t -i:6600) 2>/dev/null || true
kill $(lsof -t -i:6601) 2>/dev/null || true

# Kill by command pattern
pkill -f "tsx watch src/api/server.ts" || true
pkill -f "next dev -p" || true

# Give processes time to clean up
sleep 3

echo "Starting ClaudeOSaar API Server..."
npm run dev &
API_PID=$!

echo "Starting ClaudeOSaar UI..."
npm run dev:ui &
UI_PID=$!

echo "ClaudeOSaar is running!"
echo "API Server: http://localhost:6600"
echo "Dashboard UI: http://localhost:6601"
echo ""
echo "Press Ctrl+C to stop both servers"

# Handle cleanup on exit
function cleanup() {
  echo ""
  echo "Stopping ClaudeOSaar..."
  kill $API_PID
  kill $UI_PID
  exit 0
}

trap cleanup INT TERM

# Wait for both processes
wait
