# Pokémon Full-Stack Application

A modern full-stack web application built with **Angular 17** (frontend) and **NestJS** (backend) for Pokémon management, exploration, and favorites collection.

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
- ✅ **CSV Import**: Bulk import functionality with file validation
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
- **Database**: SQLite with TypeORM for data persistence
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

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.17.0 or higher
- **npm**: v11.4.1 or higher
- **Angular CLI**: Latest version (optional but recommended)

### Quick Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokemon_aplication
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - **Backend API**: `http://localhost:3000`
   - **Frontend App**: `http://localhost:4200`
   
   The application will automatically open in your default browser.

### Individual Development Servers

**Backend only:**
```bash
npm run backend:dev
# Starts NestJS server on port 3000
```

**Frontend only:**
```bash
npm run frontend:dev  
# Starts Angular dev server on port 4200
```

## 🔧 Configuration

### Backend Environment
Default configuration works out of the box. Customize if needed:

```typescript
// Default values
JWT_SECRET: 'pokemon-secret-key'
PORT: 3000
DATABASE: 'pokemon.db' (SQLite - auto-created)
```

### Frontend Configuration
- **API Base URL**: Automatically configured for `http://localhost:3000/api`
- **Material Theme**: Custom Pokémon-themed color palette
- **Responsive Breakpoints**: Mobile (768px), Tablet (1024px), Desktop (1200px+)

## 📊 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/register    # User registration
POST /api/auth/login       # User login  
GET  /api/auth/profile     # Get current user (protected)
```

### Pokémon Management Endpoints
```typescript
GET  /api/pokemon/first-ten      # Get first 10 Pokémon for home page
GET  /api/pokemon/search         # Advanced search with filters
GET  /api/pokemon/types          # Get all available Pokémon types
GET  /api/pokemon/:id            # Get specific Pokémon by ID
POST /api/pokemon/import         # CSV import (protected)
GET  /api/pokemon/count          # Get total Pokémon count
```

### Request/Response Examples

**Search with filters:**
```typescript
GET /api/pokemon/search?name=pika&type=Electric&legendary=false&page=1&limit=20

Response: {
  data: Pokemon[],
  total: number,
  page: number,
  limit: number
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

### Common Issues

**Port conflicts:**  
```bash
# Check if ports are in use
lsof -i :3000  # Backend
lsof -i :4200  # Frontend
```

**Database issues:**
```bash
# Reset database (delete pokemon.db in backend folder)
rm backend/pokemon.db
# Restart backend to regenerate
```

**Dependencies:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Getting Help
- Check browser console for frontend errors
- Check terminal output for backend errors  
- Ensure all dependencies are properly installed
- Verify Node.js and npm versions meet requirements

## 🚀 Deployment

### Local Docker Deployment

**Quick Start with Docker:**
```bash
# Option 1: Using Makefile (Recommended)
make quick-start

# Option 2: Using Docker Compose
docker-compose up -d

# Option 3: Using build script
./deployment/docker-build.sh
docker-compose up -d
```

**Available Make Commands:**
```bash
make help           # Show all available commands
make build          # Build Docker images
make up             # Start services
make down           # Stop services
make logs           # View logs
make clean          # Clean up resources
```

### ☁️ Cloud Deployment Options

#### 🌟 **Railway (Recommended)**
- **Free Tier**: $5 credits/month
- **Docker Support**: Native Docker deployment
- **Auto-Deploy**: GitHub integration

```bash
# Deploy to Railway
npm install -g @railway/cli
railway login
railway up
```
📖 **[Complete Railway Guide](./deployment/railway-deploy.md)**

#### 🎯 **Render**
- **Free Tier**: 750 hours/month
- **PostgreSQL**: Free database included
- **Auto-Deploy**: GitHub integration

```bash
# Deploy to Render (auto-deploys on git push)
git push origin main
```
📖 **[Complete Render Guide](./deployment/render-deploy.md)**

#### ⚡ **Other Options**
- **Vercel + PlanetScale**: Serverless deployment
- **Netlify + Supabase**: JAMstack approach
- **DigitalOcean**: VPS deployment

📖 **[Full Deployment Guide](./deployment/deployment-overview.md)**

### 🐳 Docker Configuration

**Multi-stage Dockerfile builds:**
- **Backend**: Node.js Alpine with security hardening
- **Frontend**: Nginx Alpine with Angular SPA support
- **Production-ready**: Health checks, non-root users, optimized layers

**Docker Features:**
- ✅ Multi-stage builds for smaller images
- ✅ Health checks for both services
- ✅ Security hardening (non-root users)
- ✅ Volume persistence for database
- ✅ Custom network configuration
- ✅ Automatic restarts

---

**Built with ❤️ using Angular 17 & NestJS**  
*A modern, responsive, and feature-rich Pokémon management application* 