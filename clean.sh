#!/bin/bash

# 🧹 Pokemon Application - Complete Clean Up
# This script resets everything to fresh clone state

echo "🧹 Cleaning Pokemon Application (Reset to Fresh Clone State)"
echo "============================================================"

# Stop all services first
echo "🛑 Stopping all services..."
./stop.sh 2>/dev/null || {
    # Manual cleanup if stop.sh fails
    echo "  📋 Manual service cleanup..."
    
    # Kill node processes
    if lsof -i :3000 >/dev/null 2>&1; then
        echo "  🔧 Killing backend (port 3000)..."
        lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    fi
    
    if lsof -i :4200 >/dev/null 2>&1; then
        echo "  🌐 Killing frontend (port 4200)..."
        lsof -ti :4200 | xargs kill -9 2>/dev/null || true
    fi
    
    # Stop PostgreSQL container
    if docker ps --format 'table {{.Names}}' | grep -q "pokemon-postgres"; then
        echo "  🐘 Stopping PostgreSQL..."
        docker stop pokemon-postgres >/dev/null 2>&1
    fi
}

echo "✅ Services stopped!"

# Remove PostgreSQL container and data
echo "🐘 Removing PostgreSQL container and ALL data..."
if docker ps -a --format 'table {{.Names}}' | grep -q "pokemon-postgres"; then
    docker stop pokemon-postgres >/dev/null 2>&1
    docker rm pokemon-postgres >/dev/null 2>&1
    echo "  ✅ PostgreSQL container removed"
else
    echo "  ℹ️ No PostgreSQL container found"
fi

# Remove PostgreSQL images (optional - saves more space)
read -p "🗑️ Remove PostgreSQL Docker image? (saves ~80MB) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rmi postgres:15-alpine >/dev/null 2>&1 && echo "  ✅ PostgreSQL image removed" || echo "  ℹ️ PostgreSQL image not found"
fi

# Remove node_modules directories
echo "📦 Removing node_modules directories..."
if [ -d "backend/node_modules" ]; then
    rm -rf backend/node_modules
    echo "  ✅ Removed backend/node_modules"
fi

if [ -d "frontend/node_modules" ]; then
    rm -rf frontend/node_modules
    echo "  ✅ Removed frontend/node_modules"
fi

if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "  ✅ Removed root node_modules"
fi

# Remove package-lock.json files
echo "🔒 Removing package-lock.json files..."
find . -name "package-lock.json" -type f -delete
echo "  ✅ All package-lock.json files removed"

# Remove Angular build artifacts
echo "🔧 Removing Angular build artifacts..."
if [ -d "frontend/.angular" ]; then
    rm -rf frontend/.angular
    echo "  ✅ Removed .angular cache"
fi

if [ -d "frontend/dist" ]; then
    rm -rf frontend/dist
    echo "  ✅ Removed dist directory"
fi

# Remove NestJS build artifacts
echo "🏗️ Removing NestJS build artifacts..."
if [ -d "backend/dist" ]; then
    rm -rf backend/dist
    echo "  ✅ Removed backend dist"
fi

# Remove log files
echo "📋 Removing log files..."
if [ -f "backend.log" ]; then
    rm -f backend.log
    echo "  ✅ Removed backend.log"
fi

if [ -f "frontend.log" ]; then
    rm -f frontend.log
    echo "  ✅ Removed frontend.log"
fi

# Remove database files (if any SQLite remains)
echo "🗄️ Removing database files..."
find . -name "*.db" -type f -delete 2>/dev/null && echo "  ✅ Removed SQLite files" || echo "  ℹ️ No SQLite files found"

# Remove .env files (reset to default)
echo "⚙️ Removing .env files..."
if [ -f "backend/.env" ]; then
    rm -f backend/.env
    echo "  ✅ Removed backend/.env"
fi

# Remove uploaded files
echo "📁 Removing upload directories..."
if [ -d "backend/uploads" ]; then
    rm -rf backend/uploads
    echo "  ✅ Removed backend/uploads"
fi

# Remove coverage and test artifacts
echo "🧪 Removing test artifacts..."
if [ -d "backend/coverage" ]; then
    rm -rf backend/coverage
    echo "  ✅ Removed backend coverage"
fi

if [ -d "frontend/coverage" ]; then
    rm -rf frontend/coverage
    echo "  ✅ Removed frontend coverage"
fi

# Docker system cleanup (optional)
read -p "🐳 Run Docker system cleanup? (removes unused images/containers) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -f >/dev/null 2>&1
    echo "  ✅ Docker system cleaned"
fi

echo ""
echo "🎉 CLEANUP COMPLETE! Project reset to fresh clone state"
echo "======================================================="
echo ""
echo "📊 Removed:"
echo "  ✅ All services stopped"
echo "  ✅ PostgreSQL container + data deleted"
echo "  ✅ All node_modules directories"
echo "  ✅ All package-lock.json files"
echo "  ✅ All build artifacts (.angular, dist/)"
echo "  ✅ All log files"
echo "  ✅ All database files"
echo "  ✅ All .env files"
echo "  ✅ Upload directories"
echo "  ✅ Test coverage reports"
echo ""
echo "🚀 Ready to test: ./setup.sh"
echo "💡 This should now work exactly like a fresh clone!"
echo ""
echo "Next steps:"
echo "1. Run: ./setup.sh"
echo "2. Wait for everything to start"
echo "3. Open: http://localhost:4200"
echo "4. Test registration, login, CSV import"
echo ""
echo "✨ Fresh start guaranteed! 🎮" 