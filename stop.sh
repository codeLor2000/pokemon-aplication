#!/bin/bash

# 🛑 Pokemon Application - Stop All Services
# This script stops PostgreSQL + Backend + Frontend

echo "🛑 Stopping Pokemon Full-Stack Application..."
echo "============================================"

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Stop Frontend (port 4200)
if port_in_use 4200; then
    echo "🌐 Stopping Angular Frontend (port 4200)..."
    lsof -ti :4200 | xargs kill -9 2>/dev/null || true
    echo "✅ Frontend stopped"
else
    echo "ℹ️ Frontend not running"
fi

# Stop Backend (port 3000)
if port_in_use 3000; then
    echo "🔧 Stopping NestJS Backend (port 3000)..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    echo "✅ Backend stopped"
else
    echo "ℹ️ Backend not running"
fi

# Stop PostgreSQL Docker container
echo "🐘 Stopping PostgreSQL database..."
if docker ps --format 'table {{.Names}}' | grep -q "pokemon-postgres"; then
    docker stop pokemon-postgres >/dev/null 2>&1
    echo "✅ PostgreSQL stopped"
else
    echo "ℹ️ PostgreSQL container not running"
fi

# Clean up log files
if [ -f "backend.log" ]; then
    rm -f backend.log
    echo "🧹 Cleaned backend.log"
fi

if [ -f "frontend.log" ]; then
    rm -f frontend.log  
    echo "🧹 Cleaned frontend.log"
fi

echo ""
echo "✅ All Pokemon Application services stopped!"
echo "============================================"
echo ""
echo "💡 To start again, run: ./setup.sh"
echo "🗄️ PostgreSQL data is preserved in Docker container"
echo "🔄 To completely remove PostgreSQL: docker rm pokemon-postgres"
echo ""
echo "Thanks for using Pokemon App! 👋" 