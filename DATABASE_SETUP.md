# 🗄️ Database Setup Guide

This guide explains how to set up and use both **SQLite** (development) and **PostgreSQL** (production) with the Pokemon application.

## 🔧 Database Configuration

The application automatically chooses the database based on environment variables:

- **Development**: SQLite (default, no setup required)
- **Production**: PostgreSQL (requires setup)

## 🚀 Quick Start (SQLite - Development)

**No setup required!** Just run:

```bash
cd backend
npm run start:dev
```

The application will automatically:
- ✅ Create `pokemon.db` SQLite file
- ✅ Set up database schema
- ✅ Ready to accept Pokemon data

## 🐘 PostgreSQL Setup (Production)

### Option 1: Local PostgreSQL

**1. Install PostgreSQL:**
```bash
# macOS (with Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/
```

**2. Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE pokemon_db;
CREATE USER pokemon_user WITH ENCRYPTED PASSWORD 'pokemon_password';
GRANT ALL PRIVILEGES ON DATABASE pokemon_db TO pokemon_user;
\q
```

**3. Set Environment Variables:**
```bash
# Create backend/.env file
NODE_ENV=production
DATABASE_URL=postgresql://pokemon_user:pokemon_password@localhost:5432/pokemon_db
JWT_SECRET=your-super-secret-production-key
PORT=3000
```

**4. Run Application:**
```bash
cd backend
npm run start:prod
```

### Option 2: Cloud PostgreSQL (Recommended)

#### 🌟 **Railway PostgreSQL**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway new pokemon-app

# Add PostgreSQL
railway add postgresql

# Get connection string
railway variables
# Copy DATABASE_URL value
```

#### 🎯 **Render PostgreSQL** 
1. Go to [Render Dashboard](https://render.com)
2. **New** → **PostgreSQL**
3. **Configure**:
   - Name: `pokemon-database`
   - Database: `pokemon_db`
   - User: `pokemon_user`
4. **Copy Internal Database URL**

#### ⚡ **Supabase PostgreSQL**
1. Go to [Supabase](https://supabase.com)
2. **New Project**
3. **Settings** → **Database**
4. **Copy Connection String**

### Option 3: Docker PostgreSQL

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: pokemon-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: pokemon_db
      POSTGRES_USER: pokemon_user
      POSTGRES_PASSWORD: pokemon_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pokemon-backend:
    build: ./backend
    depends_on:
      - postgres
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://pokemon_user:pokemon_password@postgres:5432/pokemon_db
      JWT_SECRET: your-secret-key
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

**Run:**
```bash
docker-compose up -d
```

## 🔄 Database Migration

### From SQLite to PostgreSQL

**Method 1: Export/Import Data**
```bash
# 1. Export from SQLite
sqlite3 backend/pokemon.db ".dump" > pokemon_export.sql

# 2. Clean up for PostgreSQL compatibility
sed -i 's/AUTOINCREMENT/SERIAL/g' pokemon_export.sql

# 3. Import to PostgreSQL
psql $DATABASE_URL < pokemon_export.sql
```

**Method 2: CSV Re-import**
```bash
# 1. Export Pokemon data to CSV
sqlite3 -header -csv backend/pokemon.db "SELECT * FROM pokemon;" > pokemon_data.csv

# 2. Use the app's CSV import feature with PostgreSQL backend
# Upload the CSV file through the web interface
```

## 🏃‍♂️ Running the Application

### Development Mode (SQLite)
```bash
# Backend
cd backend
npm run start:dev

# Frontend  
cd frontend
npm start

# Access: http://localhost:4200
```

### Production Mode (PostgreSQL)
```bash
# Set environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://user:pass@host:port/db

# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Serve dist/ folder with web server
```

### Docker Mode (Full Stack)
```bash
# With PostgreSQL
docker-compose up -d

# Access: http://localhost
```

## 🔧 Environment Variables

### Development (.env)
```bash
NODE_ENV=development
DATABASE_PATH=pokemon.db
JWT_SECRET=dev-secret
PORT=3000
```

### Production (.env)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=super-secure-production-key
PORT=3000
FRONTEND_URL=https://your-domain.com
```

## 🧪 Database Management Commands

```bash
# Generate migration
npm run db:generate -- -n MigrationName

# Run migrations
npm run db:run

# Revert migration
npm run db:revert

# Drop database schema
npm run db:drop
```

## 🐛 Troubleshooting

### Common PostgreSQL Issues

**Connection refused:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
sudo systemctl status postgresql

# Check connection string format
postgresql://username:password@host:port/database
```

**SSL connection required:**
```bash
# Add SSL to connection string
postgresql://user:pass@host:port/db?ssl=true&sslmode=require
```

**Permission denied:**
```bash
# Grant database privileges
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE pokemon_db TO pokemon_user;
GRANT ALL ON SCHEMA public TO pokemon_user;
```

### Common SQLite Issues

**Database locked:**
```bash
# Close all connections and restart backend
rm backend/pokemon.db
npm run start:dev
```

**No data after restart:**
```bash
# SQLite file location
ls -la backend/pokemon.db
# Re-import CSV data through web interface
```

## 📊 Performance Comparison

| Aspect | SQLite | PostgreSQL |
|--------|---------|------------|
| **Setup** | ✅ Zero setup | ⚙️ Requires setup |
| **Development** | ✅ Perfect | 🔧 Overkill |
| **Production** | ⚠️ Limited | ✅ Excellent |
| **Concurrent Users** | ~100 | ~10,000+ |
| **ACID Compliance** | ✅ Full | ✅ Full |
| **Backup/Restore** | 📁 File copy | 🔄 pg_dump/restore |

## 🎯 Recommendations

- **💻 Development**: Use SQLite (default)
- **🚀 Production**: Use PostgreSQL
- **🐳 Docker**: PostgreSQL with volumes
- **☁️ Cloud**: Managed PostgreSQL (Railway/Render)

---

**✅ Your Pokemon app now supports both SQLite and PostgreSQL!** 