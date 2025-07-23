# 🚀 Deploy to Render

Render is an excellent free platform for deploying fullstack applications with great Docker support.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Render CLI** (optional): `pip install render-cli`

## 🏗️ Deployment Setup

### Step 1: Create Render Services

#### Backend Web Service

1. **Go to Render Dashboard** → **New** → **Web Service**
2. **Connect GitHub Repository**: Select your `pokemon_aplication` repo
3. **Configure Service**:
   ```yaml
   Name: pokemon-backend
   Runtime: Docker
   Branch: main
   Root Directory: backend
   ```

4. **Build & Deploy Settings**:
   ```bash
   Build Command: docker build -t pokemon-backend .
   Start Command: node dist/main
   ```

5. **Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-production-key
   ```

#### Frontend Static Site

1. **New** → **Static Site**
2. **Connect Same Repository**
3. **Configure Static Site**:
   ```yaml
   Name: pokemon-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist/frontend
   ```

## 📄 Render Configuration Files

### Backend: `backend/render.yaml`
```yaml
services:
  - type: web
    name: pokemon-backend
    runtime: docker
    dockerfilePath: ./Dockerfile
    plan: free
    region: oregon
    branch: main
    rootDir: backend
    healthCheckPath: /api
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: JWT_SECRET
        generateValue: true
    scaling:
      minInstances: 1
      maxInstances: 1
```

### Frontend: `frontend/render.yaml`
```yaml
services:
  - type: web
    name: pokemon-frontend
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist/frontend
    plan: free
    branch: main
    rootDir: frontend
    headers:
      - path: /*
        name: X-Frame-Options
        value: SAMEORIGIN
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

## 🗄️ Database Setup (PostgreSQL)

### Create PostgreSQL Database

1. **Render Dashboard** → **New** → **PostgreSQL**
2. **Configure Database**:
   ```yaml
   Name: pokemon-database
   Database: pokemon_db
   User: pokemon_user
   Region: Oregon (same as backend)
   Plan: Free
   ```

3. **Get Connection Details**:
   - Internal Database URL (for backend)
   - External Database URL (for migrations)

### Update Backend for PostgreSQL

**Install PostgreSQL driver**:
```bash
cd backend
npm install pg @types/pg
```

**Update `backend/src/app.module.ts`**:
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    // ... other modules
  ],
})
```

**Add to Backend Environment Variables**:
```bash
DATABASE_URL=${{pokemon-database.DATABASE_URL}}
```

## 🔧 Build Commands & Scripts

### Frontend Build Script
Create `frontend/build.sh`:
```bash
#!/bin/bash
echo "🏗️ Building Pokemon Frontend for Render..."

# Install dependencies
npm ci

# Build for production
npm run build

# Copy nginx config for static serving
cp nginx.conf dist/nginx.conf

echo "✅ Frontend build completed!"
```

### Backend Build Optimization
Update `backend/package.json`:
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "render:build": "npm ci && npm run build",
    "render:start": "npm run start:prod"
  }
}
```

## 🌐 Custom Domain & SSL

### Free SSL Certificate
- Render automatically provides SSL certificates
- Your app will be available at `https://your-app.onrender.com`

### Custom Domain
1. **Service Settings** → **Custom Domains**
2. **Add Domain**: `yourdomain.com`
3. **Update DNS**: Point CNAME to `your-app.onrender.com`

## 📊 Monitoring & Performance

### Health Checks
```typescript
// backend/src/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

### Performance Monitoring
- **Metrics**: CPU, Memory usage in Render Dashboard
- **Logs**: Real-time logs with filtering
- **Alerts**: Email notifications for service issues

## 💰 Render Pricing

### Free Tier Limits:
- **Web Services**: 750 hours/month (sleeps after 15min inactivity)
- **Static Sites**: Unlimited
- **PostgreSQL**: 1GB storage, 1 month retention
- **Bandwidth**: 100GB/month

### Paid Plans:
- **Starter**: $7/month (no sleep, more resources)
- **Standard**: $25/month (auto-scaling, dedicated instances)

## 🚀 Deployment Workflow

### Automatic Deployment
```bash
# Every git push triggers auto-deployment
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Manual Deployment
1. **Render Dashboard** → **Service** → **Manual Deploy**
2. **Trigger Deploy** → Select branch → **Deploy**

## 🐛 Troubleshooting

### Common Issues:

**Build Failures**:
```bash
# Check build logs in Render Dashboard
# Common fixes:
- Ensure Docker builds locally first
- Check Node.js version compatibility
- Verify package.json scripts
```

**Service Won't Start**:
```bash
# Check environment variables
# Verify PORT environment variable (Render uses dynamic ports)
# Check health check endpoint
```

**Database Connection Issues**:
```bash
# Verify DATABASE_URL format
# Check PostgreSQL service status
# Ensure SSL is configured correctly
```

### Debug Commands:
```bash
# Test Docker build locally
docker build -t test-backend ./backend
docker run -p 3000:3000 test-backend

# Test frontend build
cd frontend && npm run build
```

## 🎯 Optimization Tips

1. **Docker Multi-stage**: Use multi-stage builds for smaller images
2. **Caching**: Enable build caching in Render
3. **Environment**: Use production builds only
4. **Health Checks**: Implement proper health endpoints
5. **Database**: Use connection pooling for PostgreSQL

## 🔒 Security Best Practices

1. **Environment Variables**: Store all secrets in Render
2. **CORS**: Configure proper CORS origins
3. **HTTPS**: Force HTTPS redirects
4. **Database**: Use SSL connections
5. **Headers**: Set security headers

## 📈 Scaling Strategy

### Horizontal Scaling (Paid Plans):
- **Auto-scaling**: Based on CPU/Memory
- **Load Balancing**: Automatic traffic distribution
- **Multiple Regions**: Deploy closer to users

---

**🎉 Your Pokemon app will be live at:**
- **Frontend**: `https://pokemon-frontend.onrender.com`
- **Backend API**: `https://pokemon-backend.onrender.com` 