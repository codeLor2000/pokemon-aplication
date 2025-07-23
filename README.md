# Pokémon Full-Stack Application

A modern full-stack web application built with **Angular 17** (frontend) and **NestJS** (backend) for Pokémon management, exploration, and favorites collection.

## 🚀 **QUICK START - One Command Setup**

**Want to run the entire application instantly? Just run:**

```bash
git clone <your-repository-url>
cd pokemon_aplication
./setup.sh
```

**That's it!** 🎉 The script will automatically:
- ✅ **Install all dependencies** (backend + frontend)
- ✅ **Start PostgreSQL database** (Docker container)
- ✅ **Launch NestJS backend** (http://localhost:3000)
- ✅ **Launch Angular frontend** (http://localhost:4200)

### **Prerequisites (Auto-checked)**
- **Node.js** v20.17.0+ 
- **npm** (comes with Node.js)
- **Docker** (for PostgreSQL database)

### **Usage**
```bash
# 🚀 Start everything (One Command)
./setup.sh

# 🛑 Stop everything  
./stop.sh

# 🧹 Reset to fresh clone state
./clean.sh

# 📋 View logs
tail -f backend.log frontend.log
```

### **Individual Service Control**

**Start services separately:**
```bash
# 1. Start PostgreSQL first
docker run -d --name pokemon-postgres \
  -e POSTGRES_DB=pokemon_db \
  -e POSTGRES_USER=pokemon_user \
  -e POSTGRES_PASSWORD=pokemon_password \
  -p 5432:5432 postgres:15-alpine

# 2. Start Backend only (Terminal 1)
cd backend
npm install              # First time only
npm run start:dev        # Development mode
# OR
npm run start           # Production mode

# 3. Start Frontend only (Terminal 2)  
cd frontend
npm install              # First time only
npm start               # Development server
# OR
ng serve                # Angular CLI command
```

**Individual service management:**
```bash
# Backend commands
cd backend
npm run start:dev       # Development with hot reload
npm run start:debug     # Debug mode
npm run start:prod      # Production mode
npm run build           # Build for production
npm run test            # Run tests

# Frontend commands  
cd frontend
npm start              # Start dev server (port 4200)
ng serve --port 4200   # Specify port
ng build               # Build for production
ng build --prod        # Production build
ng test                # Run unit tests
ng e2e                 # Run e2e tests
```

**Database management:**
```bash
# PostgreSQL commands
docker start pokemon-postgres     # Start existing container
docker stop pokemon-postgres      # Stop container
docker restart pokemon-postgres   # Restart container
docker logs pokemon-postgres      # View logs
docker rm pokemon-postgres        # Remove container (deletes data!)

# Reset database data
docker stop pokemon-postgres && docker rm pokemon-postgres
# Then run ./setup.sh to recreate fresh database
```

**Development workflow:**
```bash
# Daily development
./setup.sh              # Start everything
# ... do development work ...  
./stop.sh               # Stop when done

# Reset for testing
./clean.sh              # Reset to fresh state
./setup.sh              # Start fresh

# Manual control
# Terminal 1: cd backend && npm run start:dev
# Terminal 2: cd frontend && npm start
# Terminal 3: docker logs -f pokemon-postgres
```

### **After Setup**
1. **Open browser**: http://localhost:4200
2. **Register/Login**: Create account or sign in
3. **Import Pokemon**: Upload CSV files (authentication required)
4. **Explore features**: Search, filter, favorites, and more!

---

## 🌟 Features

### Authentication & Security
- ✅ User registration and login with JWT authentication
- ✅ Password hashing with bcrypt for security
- ✅ Protected routes with authentication guards
- ✅ Automatic token management and refresh
- ✅ Session persistence and user profile management

### Home Page Experience
- ✅ Modern responsive hero section with dynamic call-to-action buttons
- ✅ Featured Pokémon YouTube video carousel (4 curated trailers)
- ✅ Interactive preview of first 10 Pokémon from database
- ✅ Pokémon cards with click-to-view details functionality
- ✅ Beautiful type color coding and legendary status indicators

### Pokémon Management System
- ✅ **CSV Import**: Bulk import functionality with file validation (requires login)
- ✅ **Advanced Search**: Real-time search with 300ms debounce timing
- ✅ **Multi-Filter System**:
  - Type filtering (dropdown with all available types)
  - Legendary status checkbox filter
  - Speed range filters (min/max with validation)
- ✅ **Smart Pagination**: Customizable page sizes (10, 20, 50, 100)
- ✅ **URL State Management**: Query parameters for shareable filtered results
- ✅ **Responsive Grid Layout**: Adaptive card-based display

### Favorites System 
- ✅ **Add/Remove Favorites**: Heart icon toggle in Pokémon detail modals
- ✅ **Persistent Storage**: LocalStorage-based favorites with automatic sync
- ✅ **Favorites Page**: Dedicated page showing all favorite Pokémon
- ✅ **Real-time Counters**: Badge counters in navigation showing favorite count
- ✅ **Batch Operations**: Clear all favorites functionality
- ✅ **Date Tracking**: Shows when each Pokémon was added to favorites

### UI/UX & Navigation
- ✅ **Angular Material Design**: Consistent Material Design components
- ✅ **Responsive Navigation**: 
  - Main toolbar with navigation links
  - Mobile-friendly sidebar navigation
  - Dynamic breadcrumb navigation system
- ✅ **Modal System**: Centered popup modals for Pokémon details
- ✅ **Loading States**: Comprehensive loading indicators and error handling
- ✅ **Notifications**: Success/error snackbar notifications
- ✅ **Template Separation**: All templates extracted to separate HTML files
- ✅ **Accessibility**: ARIA labels and keyboard navigation support

### Technical Excellence
- ✅ **Modern Angular 17**: Standalone components with new control flow syntax
- ✅ **Reactive Programming**: Angular Signals and RxJS for state management
- ✅ **Type Safety**: Full TypeScript implementation with strict typing
- ✅ **Component Architecture**: Modular feature-based folder structure
- ✅ **Code Organization**: Separation of concerns with clean architecture

## 🏗️ Technology Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM for data persistence
- **Authentication**: JWT with Passport.js strategy
- **File Processing**: Multer for CSV upload and processing
- **Validation**: class-validator and class-transformer
- **Security**: bcrypt for password hashing, CORS configuration

### Frontend (Angular 17)
- **Framework**: Angular 17 with standalone components
- **UI Library**: Angular Material with comprehensive component usage
- **Styling**: SCSS with modern design principles and responsive breakpoints
- **State Management**: Angular Signals with reactive programming patterns
- **HTTP Communication**: Angular HttpClient with interceptors
- **Forms**: Reactive Forms with comprehensive validation
- **Routing**: Angular Router with guards and lazy loading

## 📁 Project Structure

```
pokemon_aplication/
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── auth/                    # JWT Authentication module
│   │   │   ├── auth.controller.ts   # Login/Register endpoints
│   │   │   ├── auth.service.ts      # Authentication logic
│   │   │   └── jwt.strategy.ts      # Passport JWT strategy
│   │   ├── pokemon/                 # Pokémon management module
│   │   │   ├── pokemon.controller.ts # API endpoints
│   │   │   ├── pokemon.service.ts   # Business logic
│   │   │   └── pokemon.entity.ts    # Database entity
│   │   ├── user/                    # User management module
│   │   └── main.ts                  # Application entry point
│   └── package.json
├── frontend/                        # Angular 17 Frontend
│   ├── src/app/
│   │   ├── core/                    # Core services and guards
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts          # Authentication service
│   │   │   │   ├── pokemon.service.ts       # Pokémon API service
│   │   │   │   └── favorites.service.ts     # Favorites management
│   │   │   └── guards/
│   │   │       └── auth.guard.ts            # Route protection
│   │   ├── features/                # Feature modules
│   │   │   ├── auth/                # Authentication components
│   │   │   │   ├── login/           # Login component
│   │   │   │   └── register/        # Registration component
│   │   │   ├── home/                # Home page component
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.scss
│   │   │   └── pokemon/             # Pokémon management
│   │   │       ├── pokemon-list/    # List and search
│   │   │       ├── favorites/       # Favorites management
│   │   │       └── pokemon-detail-modal/ # Detail modal
│   │   ├── shared/                  # Shared components
│   │   │   └── components/
│   │   │       └── breadcrumb/      # Navigation breadcrumb
│   │   ├── app.component.ts         # Root component
│   │   ├── app.component.html       # Main template
│   │   └── app.routes.ts            # Routing configuration
│   ├── styles.scss                  # Global styles
│   └── index.html                   # HTML entry point
└── README.md
```

## 🛠️ Alternative Setup Methods

**Already used the quick setup? Great! Skip this section.**  
**Need manual control? Here are alternative methods:**

### Method 1: 📋 Manual Step-by-Step

**Prerequisites:**
- **Node.js** v20.17.0+
- **npm** 11.4.1+  
- **Docker** (for PostgreSQL)

**Steps:**
```bash
# 1. Clone and enter directory
git clone <repository-url>
cd pokemon_aplication

# 2. Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Start PostgreSQL (Docker)
docker run -d --name pokemon-postgres \
  -e POSTGRES_DB=pokemon_db \
  -e POSTGRES_USER=pokemon_user \
  -e POSTGRES_PASSWORD=pokemon_password \
  -p 5432:5432 postgres:15-alpine

# 4. Start Backend (Terminal 1)
cd backend && npm run start:dev

# 5. Start Frontend (Terminal 2) 
cd frontend && npm start
```

### Method 2: 🐳 Docker Compose (Full Stack)

```bash
# Build and run with Docker
docker-compose up -d

# Access applications
# Frontend: http://localhost
# Backend: http://localhost:3000
```

### Method 3: 🔧 Makefile Commands

```bash
# Install dependencies
make install

# Start development environment
make dev-backend    # Terminal 1
make dev-frontend   # Terminal 2

# Or use quick start (Docker)
make quick-start
```

## 📄 Configuration

### Database (PostgreSQL)
The application automatically uses **PostgreSQL** via Docker container:

```bash
# Auto-created PostgreSQL container
Container: pokemon-postgres
Database: pokemon_db
User: pokemon_user  
Password: pokemon_password
Port: 5432 (PostgreSQL) → http://localhost:5432
```

### Backend Environment (.env auto-created)
```bash
NODE_ENV=development
PORT=3000
JWT_SECRET=pokemon-secret-key
DATABASE_URL=postgresql://pokemon_user:pokemon_password@localhost:5432/pokemon_db
FRONTEND_URL=http://localhost:4200
```

### Frontend Configuration
- **API Base URL**: Automatically configured for `http://localhost:3000/api`
- **Material Theme**: Custom Pokémon-themed color palette
- **Responsive Breakpoints**: Mobile (768px), Tablet (1024px), Desktop (1200px+)

## 🔐 Important: Authentication Required

### ⚠️ **CSV Import Requires Login**
- **CSV import endpoint is PROTECTED** 
- **You must register/login first** before importing CSV files
- Anonymous users will get **"Unauthorized"** error

### Authentication Flow
1. **Register**: `POST /api/auth/register` → Get JWT token
2. **Login**: `POST /api/auth/login` → Get JWT token  
3. **Import CSV**: `POST /api/pokemon/import` (with JWT token)

## 📊 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/register    # User registration → JWT token
POST /api/auth/login       # User login → JWT token
GET  /api/auth/profile     # Get current user (🔒 protected)
```

### Pokémon Management Endpoints
```typescript
GET  /api/pokemon/first-ten      # Get first 10 Pokémon (public)
GET  /api/pokemon/search         # Advanced search with filters (public)
GET  /api/pokemon/types          # Get all available Pokémon types (public)
GET  /api/pokemon/:id            # Get specific Pokémon by ID (public)
POST /api/pokemon/import         # CSV import (🔒 protected - JWT required)
POST /api/pokemon/clear-all      # Delete all Pokémon (🔒 protected)
GET  /api/pokemon/count          # Get total Pokémon count (public)
```

### Request/Response Examples

**User Registration:**
```typescript
POST /api/auth/register
{
  "username": "pokemon_trainer",
  "password": "secure_password123"
}

Response: {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "username": "pokemon_trainer" }
}
```

**Search with filters:**
```typescript
GET /api/pokemon/search?name=pika&type=Electric&legendary=false&page=1&limit=20

Response: {
  data: Pokemon[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

**CSV Import (with authentication):**
```typescript
POST /api/pokemon/import
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Body: FormData with CSV file

Response: {
  "message": "Successfully imported X Pokemon",
  "imported": number,
  "errors": []
}
```

## 📝 CSV Import Format

Upload CSV files with these columns (case-insensitive):

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `Name` | ✅ | Pokémon name | "Pikachu" |
| `Type1` | ✅ | Primary type | "Electric" |
| `Type2` | ❌ | Secondary type | "Flying" |
| `Total` | ✅ | Total base stats | 320 |
| `HP` | ✅ | Hit Points | 35 |
| `Attack` | ✅ | Attack stat | 55 |
| `Defense` | ✅ | Defense stat | 40 |
| `Sp. Atk` | ✅ | Special Attack | 50 |
| `Sp. Def` | ✅ | Special Defense | 50 |
| `Speed` | ✅ | Speed stat | 90 |
| `Generation` | ✅ | Generation number | 1 |
| `Legendary` | ✅ | Legendary status | true/false |
| `Image` | ❌ | Image URL | "https://..." |

## 🎨 UI/UX Features

### Home Page
- **Hero Section**: Gradient background with authentication-aware content
- **Video Carousel**: 4 embedded YouTube trailers with responsive design
- **Pokémon Preview**: Interactive grid showing first 10 Pokémon
- **Dynamic Actions**: Context-aware buttons based on authentication status

### Pokémon List Page (Protected)
- **File Upload**: Drag-and-drop CSV import with validation
- **Live Search**: Instant search with 300ms debounce optimization
- **Advanced Filters**: Collapsible panel with multiple filter options
- **Results Management**: Pagination, sorting, and result count display
- **Loading States**: Skeleton loading and empty state handling

### Favorites System
- **Heart Toggle**: One-click add/remove from any Pokémon detail
- **Dedicated Page**: Full-featured favorites management interface
- **Badge Counters**: Real-time count display in navigation
- **Date Tracking**: Human-readable "added X days ago" timestamps
- **Batch Operations**: Clear all functionality with confirmation

### Navigation System
- **Main Toolbar**: Primary navigation with active link highlighting
- **Responsive Sidebar**: Mobile-friendly drawer navigation
- **Breadcrumb Trail**: Dynamic breadcrumb showing current page path
- **User Menu**: Dropdown with profile and logout options

## 📱 Responsive Design

**Desktop (1200px+)**
- Full sidebar navigation
- 5-column Pokémon grid
- Expanded toolbar with all navigation items

**Tablet (768px - 1199px)**  
- Collapsible sidebar
- 3-column Pokémon grid
- Condensed navigation

**Mobile (< 768px)**
- Hamburger menu navigation
- Single-column Pokémon grid
- Touch-optimized interactions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Request Validation**: Comprehensive input validation and sanitization
- **CORS Protection**: Configured cross-origin resource sharing
- **File Security**: CSV-only upload restrictions with MIME type validation
- **Route Guards**: Protected endpoints and client-side route protection
- **XSS Protection**: Angular's built-in sanitization and security

## 🧪 Testing & Quality

### Running Tests

**Backend Tests:**
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests  
npm run test:cov      # Coverage report
```

**Frontend Tests:**
```bash
cd frontend
ng test               # Unit tests with Karma
ng e2e                # End-to-end tests with Protractor
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Angular-specific rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🏗️ Production Build

### Build Commands

**Full Production Build:**
```bash
npm run build:all
# Builds both backend and frontend for production
```

**Individual Builds:**
```bash
npm run backend:build    # NestJS production build
npm run frontend:build   # Angular production build
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Static assets optimized
- [ ] Security headers configured
- [ ] SSL certificates installed
- [ ] Performance monitoring enabled

## 🚀 Performance Optimizations

- **Lazy Loading**: Feature modules loaded on demand
- **OnPush Strategy**: Optimized change detection
- **TrackBy Functions**: Efficient list rendering
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Splitting**: Optimized chunk sizes for faster loading
- **Service Workers**: PWA capabilities (ready for implementation)

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)  
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Angular style guide
- Write comprehensive tests
- Update documentation
- Use conventional commit messages

## 📄 License

This project is developed as a technical assessment demonstration and is for educational purposes.

## 🙋‍♂️ Support & Troubleshooting

### ⚡ Quick Fixes

**Application won't start with `./setup.sh`?**
```bash
# Check prerequisites
node --version    # Should be v20.17.0+
npm --version     # Should be v11.4.1+
docker --version  # Should be installed

# Make sure Docker is running
open /Applications/Docker.app  # macOS
# Or restart Docker Desktop

# Clean restart
./stop.sh        # Stop everything
./setup.sh       # Start fresh
```

**"Unauthorized" error when importing CSV?**
```bash
# ✅ Solution: You MUST login first!
# 1. Open http://localhost:4200
# 2. Click "Register" or "Login"  
# 3. Create account or sign in
# 4. Then try CSV import again
```

**"409 Conflict" error when registering?**
```bash
# ✅ Solution: Username already exists in database!
# Option 1: Try different username
# Option 2: Reset database completely
./clean.sh               # Reset everything
./setup.sh               # Start fresh with empty database

# Option 3: Remove just the database
docker stop pokemon-postgres
docker rm pokemon-postgres
./setup.sh               # Will recreate fresh database
```

### 🔧 Advanced Troubleshooting

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :3000  # Backend (NestJS)
lsof -i :4200  # Frontend (Angular)
lsof -i :5432  # PostgreSQL

# Kill conflicting processes
./stop.sh      # Stops all Pokemon app services
```

**PostgreSQL database issues:**
```bash
# Reset PostgreSQL data
docker stop pokemon-postgres
docker rm pokemon-postgres    # ⚠️ This deletes all data!
./setup.sh                     # Recreates fresh database

# View PostgreSQL logs
docker logs pokemon-postgres
```

**Backend won't connect to database:**
```bash
# Check PostgreSQL container status
docker ps | grep postgres

# Restart database
docker restart pokemon-postgres

# Check backend logs
tail -f backend.log
```

**Frontend build errors:**
```bash
# Clear Angular cache
cd frontend
rm -rf node_modules .angular dist
npm install

# Check frontend logs  
tail -f ../frontend.log
```

**Dependencies issues:**
```bash
# Clean install everything
./stop.sh

# Backend clean
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

# Frontend clean  
cd frontend
rm -rf node_modules package-lock.json .angular
npm install
cd ..

# Restart
./setup.sh
```

### 📊 Service Status Check

```bash
# Check all services
curl http://localhost:3000/api    # Backend health
curl http://localhost:4200        # Frontend health
docker ps | grep postgres         # Database status

# View all logs together
tail -f backend.log frontend.log
```

### 🆘 Getting Help

**Before asking for help, please provide:**
1. **OS and versions**: 
   ```bash
   uname -a                    # OS info
   node --version              # Node.js version
   npm --version               # npm version
   docker --version            # Docker version
   ```

2. **Error logs**:
   ```bash
   tail -50 backend.log        # Last 50 backend log lines
   tail -50 frontend.log       # Last 50 frontend log lines
   ```

3. **Service status**:
   ```bash
   docker ps                   # Running containers
   lsof -i :3000 -i :4200 -i :5432  # Port usage
   ```

**Common Error Messages:**
- **"Cannot connect to Docker daemon"** → Start Docker Desktop
- **"Port already in use"** → Run `./stop.sh` first
- **"Unauthorized"** → Login required for CSV import
- **"409 Conflict"** → Username already exists, try different name or reset database
- **"EADDRINUSE"** → Port conflict, use `./stop.sh`
- **"Module not found"** → Run `npm install` in affected directory

## 🚀 Deployment

### ☁️ Cloud Deployment Options

The application is ready for deployment on various platforms:

#### 🌟 **Railway (Recommended)**
- **Free Tier**: $5 credits/month
- **Native Docker Support**: Perfect for this stack
- **Auto-Deploy**: GitHub integration

```bash
npm install -g @railway/cli
railway login
railway up
```

#### 🎯 **Render**
- **Free Tier**: 750 hours/month
- **Free PostgreSQL**: 1GB database included
- **Auto-Deploy**: GitHub integration

#### ⚡ **Other Options**
- **Vercel + PlanetScale**: Serverless approach
- **Netlify + Supabase**: JAMstack deployment
- **DigitalOcean**: VPS deployment

### 🐳 Docker Production

```bash
# Build production images
docker build -t pokemon-backend ./backend
docker build -t pokemon-frontend ./frontend

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Additional Resources

- 📖 **[Complete Deployment Guide](./deployment/deployment-overview.md)**
- 📖 **[Railway Deployment](./deployment/railway-deploy.md)**
- 📖 **[Database Setup Guide](./DATABASE_SETUP.md)**

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Angular and NestJS best practices
- Write comprehensive tests
- Update documentation
- Use conventional commit messages

---

## 🎉 **Quick Recap**

**Getting started is super simple:**

```bash
git clone <your-repository-url>
cd pokemon_aplication
./setup.sh
```

**Then enjoy:**
- 🌐 **Frontend**: http://localhost:4200
- 🔧 **Backend**: http://localhost:3000  
- 🐘 **PostgreSQL**: Fully managed via Docker

**Built with ❤️ using:**
- **Frontend**: Angular 17 + Angular Material
- **Backend**: NestJS + TypeORM + JWT Auth
- **Database**: PostgreSQL
- **Deployment**: Docker + Multiple cloud options

*A modern, responsive, and feature-rich Pokémon management application ready for production! 🎮✨* 