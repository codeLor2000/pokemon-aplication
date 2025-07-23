#!/bin/bash

# 🚀 Pokemon Application - One Command Setup
# This script starts PostgreSQL + Backend + Frontend

echo "🎉 Starting Pokemon Full-Stack Application..."
echo "=========================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to kill processes on port with retries
kill_port() {
    local port=$1
    local service_name=$2
    
    if port_in_use $port; then
        echo "  ⚠️ Port $port is already in use, killing existing processes..."
        
        # Try multiple methods to kill processes
        lsof -ti :$port | xargs kill -15 2>/dev/null || true  # SIGTERM first
        sleep 2
        
        # Force kill if still running
        if port_in_use $port; then
            echo "  🔧 Force killing processes on port $port..."
            lsof -ti :$port | xargs kill -9 2>/dev/null || true  # SIGKILL
            sleep 2
        fi
        
        # Final check
        if port_in_use $port; then
            echo "  ❌ Unable to free port $port. Please manually kill processes using this port."
            echo "  💡 Run: lsof -i :$port and kill the processes, then try again."
            exit 1
        else
            echo "  ✅ Port $port freed for $service_name"
        fi
    fi
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js v20.17.0 or higher"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker"
    exit 1
fi

echo "✅ All prerequisites met!"

# Clean up ports before starting
echo "🧹 Cleaning up ports..."
kill_port 3000 "Backend"
kill_port 4200 "Frontend"

# Install dependencies if node_modules don't exist
echo "📦 Installing dependencies..."

if [ ! -d "backend/node_modules" ]; then
    echo "  📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "  📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependencies installed!"

# Start PostgreSQL Docker container
echo "🐘 Starting PostgreSQL database..."

# Check if container already exists
if docker ps -a --format 'table {{.Names}}' | grep -q "pokemon-postgres"; then
    echo "  🔄 PostgreSQL container exists, starting..."
    docker start pokemon-postgres >/dev/null 2>&1
else
    echo "  🆕 Creating new PostgreSQL container..."
    docker run -d \
        --name pokemon-postgres \
        -e POSTGRES_DB=pokemon_db \
        -e POSTGRES_USER=pokemon_user \
        -e POSTGRES_PASSWORD=pokemon_password \
        -p 5432:5432 \
        --restart unless-stopped \
        postgres:15-alpine >/dev/null 2>&1
fi

# Wait for PostgreSQL to be ready
echo "  ⏳ Waiting for PostgreSQL to be ready..."
sleep 8

echo "✅ PostgreSQL is running!"

# Start Backend
echo "🔧 Starting NestJS Backend..."

# Double check port is free
kill_port 3000 "Backend"

cd backend
echo "  🚀 Starting backend server..."
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "  ⏳ Waiting for backend to be ready..."
for i in {1..45}; do
    if curl -s http://localhost:3000/api >/dev/null 2>&1; then
        echo "✅ Backend is running on http://localhost:3000"
        break
    fi
    if [ $i -eq 45 ]; then
        echo "❌ Backend failed to start. Check backend.log for details."
        echo "📋 Last few lines of backend.log:"
        tail -10 backend.log 2>/dev/null || echo "No backend.log found"
        exit 1
    fi
    sleep 2
done

# Start Frontend
echo "🌐 Starting Angular Frontend..."

# Double check port is free
kill_port 4200 "Frontend"

cd frontend
echo "  🚀 Starting frontend server..."
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "  ⏳ Waiting for frontend to be ready..."
for i in {1..90}; do
    if curl -s http://localhost:4200 >/dev/null 2>&1; then
        echo "✅ Frontend is running on http://localhost:4200"
        break
    fi
    if [ $i -eq 90 ]; then
        echo "❌ Frontend failed to start. Check frontend.log for details."
        echo "📋 Last few lines of frontend.log:"
        tail -10 frontend.log 2>/dev/null || echo "No frontend.log found"
        exit 1
    fi
    sleep 2
done

# Success message
echo ""
echo "🎉 SUCCESS! Pokemon Application is running!"
echo "=========================================="
echo "🌐 Frontend:  http://localhost:4200"
echo "🔧 Backend:   http://localhost:3000"
echo "🐘 Database:  PostgreSQL on port 5432"
echo ""
echo "📋 Next steps:"
echo "1. Open http://localhost:4200 in your browser"
echo "2. Register a new account or login"
echo "3. Go to Pokemon List and import CSV files"
echo "4. Use sample_pokemon.csv for testing"
echo ""
echo "📊 Service Status:"
echo "  Backend PID:  $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 To stop all services, run: ./stop.sh"
echo "📋 To view logs: tail -f backend.log frontend.log"
echo "🧹 To reset everything: ./clean.sh"
echo ""
echo "Happy Pokemon hunting! 🎮✨" 