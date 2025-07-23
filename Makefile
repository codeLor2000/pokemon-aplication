# Pokemon Application Makefile
# Usage: make <command>

.PHONY: help build build-backend build-frontend up down dev clean test deploy-railway deploy-render

# Default target
help: ## Show this help message
	@echo "Pokemon Application - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

# Docker Commands
build: ## Build all Docker images
	@echo "🏗️ Building Pokemon Application Docker Images..."
	@docker build -t pokemon-backend:latest ./backend
	@docker build -t pokemon-frontend:latest ./frontend
	@echo "✅ Docker images built successfully!"

build-backend: ## Build backend Docker image only
	@echo "🏗️ Building backend Docker image..."
	@docker build -t pokemon-backend:latest ./backend
	@echo "✅ Backend image built!"

build-frontend: ## Build frontend Docker image only  
	@echo "🏗️ Building frontend Docker image..."
	@docker build -t pokemon-frontend:latest ./frontend
	@echo "✅ Frontend image built!"

up: ## Start all services with docker-compose
	@echo "🚀 Starting Pokemon Application..."
	@docker-compose up -d
	@echo "✅ Application started!"
	@echo "🌐 Frontend: http://localhost"
	@echo "🔧 Backend API: http://localhost:3000"

down: ## Stop all services
	@echo "🛑 Stopping Pokemon Application..."
	@docker-compose down
	@echo "✅ Application stopped!"

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "✅ Development environment ready!"

logs: ## Show application logs
	@docker-compose logs -f

logs-backend: ## Show backend logs only
	@docker-compose logs -f backend

logs-frontend: ## Show frontend logs only
	@docker-compose logs -f frontend

# Cleanup Commands
clean: ## Remove all Docker containers and images
	@echo "🧹 Cleaning up Docker resources..."
	@docker-compose down -v --remove-orphans
	@docker rmi pokemon-backend:latest pokemon-frontend:latest 2>/dev/null || true
	@docker system prune -f
	@echo "✅ Cleanup completed!"

clean-volumes: ## Remove Docker volumes (WARNING: Data loss!)
	@echo "⚠️ WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker volume prune -f; \
		echo "✅ Volumes cleaned!"; \
	else \
		echo "❌ Cleanup cancelled"; \
	fi

# Development Commands
install: ## Install dependencies for both frontend and backend
	@echo "📦 Installing dependencies..."
	@cd backend && npm install
	@cd frontend && npm install
	@echo "✅ Dependencies installed!"

install-backend: ## Install backend dependencies only
	@cd backend && npm install

install-frontend: ## Install frontend dependencies only
	@cd frontend && npm install

dev-backend: ## Start backend in development mode
	@cd backend && npm run start:dev

dev-frontend: ## Start frontend in development mode
	@cd frontend && npm start

# Testing Commands
test: ## Run all tests
	@echo "🧪 Running tests..."
	@cd backend && npm test
	@cd frontend && npm test
	@echo "✅ All tests completed!"

test-backend: ## Run backend tests only
	@cd backend && npm test

test-frontend: ## Run frontend tests only
	@cd frontend && npm test

test-e2e: ## Run end-to-end tests
	@cd backend && npm run test:e2e

# Production Build Commands
build-prod: ## Build for production
	@echo "🏗️ Building for production..."
	@cd backend && npm run build
	@cd frontend && npm run build
	@echo "✅ Production build completed!"

# Deployment Commands
deploy-railway: ## Deploy to Railway
	@echo "🚀 Deploying to Railway..."
	@command -v railway >/dev/null 2>&1 || { echo "❌ Railway CLI not installed. Run: npm install -g @railway/cli"; exit 1; }
	@railway up
	@echo "✅ Deployed to Railway!"

deploy-render: ## Deploy to Render (via Git push)
	@echo "🚀 Deploying to Render..."
	@git add .
	@git commit -m "Deploy to Render - $(shell date)"
	@git push origin main
	@echo "✅ Pushed to Git! Check Render dashboard for deployment status."

# Database Commands
db-backup: ## Backup database
	@echo "💾 Creating database backup..."
	@mkdir -p ./backups
	@docker-compose exec backend sqlite3 /app/database/pokemon.db ".dump" > ./backups/pokemon-backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "✅ Database backup created in ./backups/"

db-restore: ## Restore database from backup (specify file with FILE=path)
	@if [ -z "$(FILE)" ]; then \
		echo "❌ Please specify backup file: make db-restore FILE=./backups/pokemon-backup-xxx.sql"; \
		exit 1; \
	fi
	@echo "📥 Restoring database from $(FILE)..."
	@docker-compose exec -T backend sqlite3 /app/database/pokemon.db < $(FILE)
	@echo "✅ Database restored!"

# Health Check Commands
health: ## Check application health
	@echo "🏥 Checking application health..."
	@curl -f http://localhost:3000/api/health >/dev/null 2>&1 && echo "✅ Backend: Healthy" || echo "❌ Backend: Unhealthy"
	@curl -f http://localhost/health >/dev/null 2>&1 && echo "✅ Frontend: Healthy" || echo "❌ Frontend: Unhealthy"

status: ## Show Docker container status
	@echo "📊 Container Status:"
	@docker-compose ps

# Utility Commands
shell-backend: ## Open shell in backend container
	@docker-compose exec backend sh

shell-frontend: ## Open shell in frontend container
	@docker-compose exec frontend sh

open: ## Open application in browser
	@echo "🌐 Opening Pokemon Application..."
	@command -v open >/dev/null 2>&1 && open http://localhost || echo "Please open http://localhost in your browser"

# Quick Start Commands
quick-start: install build up ## Quick start: install, build, and run
	@echo ""
	@echo "🎉 Pokemon Application is ready!"
	@echo "🌐 Frontend: http://localhost"
	@echo "🔧 Backend API: http://localhost:3000"
	@echo ""
	@echo "📋 Useful commands:"
	@echo "  make logs     - View application logs"
	@echo "  make down     - Stop application"
	@echo "  make clean    - Clean up Docker resources"

restart: down up ## Restart the application

# Environment Setup
setup-env: ## Setup environment files
	@echo "⚙️ Setting up environment files..."
	@if [ ! -f backend/.env ]; then \
		echo "JWT_SECRET=pokemon-secret-key-development" > backend/.env; \
		echo "NODE_ENV=development" >> backend/.env; \
		echo "PORT=3000" >> backend/.env; \
		echo "✅ Created backend/.env"; \
	fi
	@echo "✅ Environment setup completed!"

# Docker Image Management
push-images: ## Push Docker images to registry (set REGISTRY variable)
	@if [ -z "$(REGISTRY)" ]; then \
		echo "❌ Please set REGISTRY variable: make push-images REGISTRY=your-registry.com"; \
		exit 1; \
	fi
	@docker tag pokemon-backend:latest $(REGISTRY)/pokemon-backend:latest
	@docker tag pokemon-frontend:latest $(REGISTRY)/pokemon-frontend:latest
	@docker push $(REGISTRY)/pokemon-backend:latest
	@docker push $(REGISTRY)/pokemon-frontend:latest
	@echo "✅ Images pushed to $(REGISTRY)!"

pull-images: ## Pull Docker images from registry (set REGISTRY variable)
	@if [ -z "$(REGISTRY)" ]; then \
		echo "❌ Please set REGISTRY variable: make pull-images REGISTRY=your-registry.com"; \
		exit 1; \
	fi
	@docker pull $(REGISTRY)/pokemon-backend:latest
	@docker pull $(REGISTRY)/pokemon-frontend:latest
	@docker tag $(REGISTRY)/pokemon-backend:latest pokemon-backend:latest
	@docker tag $(REGISTRY)/pokemon-frontend:latest pokemon-frontend:latest
	@echo "✅ Images pulled from $(REGISTRY)!" 