#!/bin/bash

# Docker Build Script for Pokemon Application
# Usage: ./deployment/docker-build.sh

set -e

echo "🚀 Building Pokemon Application Docker Images..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_warning "docker-compose not found. Using 'docker compose' instead."
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Navigate to project root
cd "$(dirname "$0")/.."

print_status "Building backend image..."
docker build -t pokemon-backend:latest ./backend

print_status "Building frontend image..."
docker build -t pokemon-frontend:latest ./frontend

print_success "Docker images built successfully!"

# Optional: Tag images for deployment
print_status "Tagging images for deployment..."
docker tag pokemon-backend:latest pokemon-app/backend:latest
docker tag pokemon-frontend:latest pokemon-app/frontend:latest

print_success "Images tagged successfully!"

# Show built images
print_status "Built images:"
docker images | grep pokemon

print_success "✅ Build process completed!"
print_status "To run the application: $DOCKER_COMPOSE up -d" 