#!/bin/bash

# Next.js Development with MCP Server
# This script starts both the Next.js dev server and MCP server concurrently

echo "🚀 Starting Next.js Development with MCP..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start both servers concurrently
echo "🔧 Starting development servers..."
npm run mcp:dev

# Alternative: Start them separately if concurrently fails
# echo "Starting Next.js dev server..."
# npm run dev &
# 
# echo "Starting MCP server..."
# npm run mcp:server &
# 
# # Wait for both processes
# wait