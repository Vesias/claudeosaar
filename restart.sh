#!/bin/bash

# This script forcefully restarts the ClaudeOSaar application

# Define ports
API_PORT=5977
UI_PORT=5978

echo "Forcefully cleaning up existing processes..."

# Kill specific processes
echo "Killing processes on specific ports..."
kill -9 $(lsof -t -i:${API_PORT} 2>/dev/null) 2>/dev/null || true
kill -9 $(lsof -t -i:${UI_PORT} 2>/dev/null) 2>/dev/null || true

# Kill TSX processes
echo "Killing tsx processes..."
pkill -9 -f "tsx watch src/api/server.ts" || true

# Kill Next.js processes
echo "Killing Next.js processes..."
pkill -9 -f "next dev -p" || true

# Give processes time to clean up
echo "Waiting for processes to terminate..."
sleep 3

# Check if ports are free
echo "Checking if ports are free..."
if lsof -i:${API_PORT} > /dev/null; then
  echo "Port ${API_PORT} is still in use. Please manually kill the process."
  exit 1
fi

if lsof -i:${UI_PORT} > /dev/null; then
  echo "Port ${UI_PORT} is still in use. Please manually kill the process."
  exit 1
fi

echo "Starting ClaudeOSaar API Server on port ${API_PORT}..."
cd "$(dirname "$0")"
NODE_ENV=development PORT=${API_PORT} npm run dev > ./logs/api.log 2>&1 &
API_PID=$!

# Wait briefly to let the API server start
sleep 2

echo "Checking if API server is running..."
if ! lsof -i:${API_PORT} > /dev/null; then
  echo "API server failed to start. Check logs/api.log for details."
  exit 1
fi

echo "Starting ClaudeOSaar UI on port ${UI_PORT}..."
NODE_ENV=development PORT=${UI_PORT} npm run dev:ui > ./logs/ui.log 2>&1 &
UI_PID=$!

# Wait briefly to let the UI server start
sleep 2

echo "Checking if UI server is running..."
if ! lsof -i:${UI_PORT} > /dev/null; then
  echo "UI server failed to start. Check logs/ui.log for details."
  exit 1
fi

echo "ClaudeOSaar is running!"
echo "API Server: http://localhost:${API_PORT}"
echo "Dashboard UI: http://localhost:${UI_PORT}"

echo ""
echo "Press Ctrl+C to stop both servers"
echo "API logs: tail -f logs/api.log"
echo "UI logs: tail -f logs/ui.log"

# Handle cleanup on exit
function cleanup() {
  echo ""
  echo "Stopping ClaudeOSaar..."
  kill $API_PID 2>/dev/null || true
  kill $UI_PID 2>/dev/null || true
  exit 0
}

trap cleanup INT TERM

# Keep the script running
wait