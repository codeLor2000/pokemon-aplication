# 🚀 Deploy to Railway

Railway is the best free platform for deploying fullstack applications with Docker support.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub
3. **Railway CLI** (optional): `npm install -g @railway/cli`

## 🏗️ Deployment Methods

### Method 1: GitHub Integration (Recommended)

#### Step 1: Create Railway Project
```bash
# Using Railway CLI
railway login
railway new pokemon-app
cd pokemon-app
```

#### Step 2: Connect GitHub Repository
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** 
3. Select **"Deploy from GitHub repo"**
4. Choose your `pokemon_aplication` repository
5. Railway will automatically detect Docker setup

#### Step 3: Configure Services

**Backend Service:**
```yaml
# railway.toml (create in backend folder)
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/main"
healthcheckPath = "/api"
healthcheckTimeout = 300

[env]
NODE_ENV = "production"
PORT = "3000"
```

**Frontend Service:**
```yaml
# railway.toml (create in frontend folder)  
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "nginx -g 'daemon off;'"
healthcheckPath = "/health"
```

#### Step 4: Environment Variables
Set in Railway Dashboard > Service > Variables:
```bash
# Backend Variables
JWT_SECRET=your-super-secret-production-key
NODE_ENV=production
PORT=3000

# Frontend Variables (if needed)
API_URL=${{backend.RAILWAY_PRIVATE_DOMAIN}}
```

### Method 2: Railway CLI Deployment

```bash
# Login to Railway
railway login

# Deploy backend
cd backend
railway up

# Deploy frontend  
cd ../frontend
railway up
```

## 🔧 Railway Configuration Files

### Backend Railway Config
Create `backend/railway.toml`:
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/main"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

[env]
NODE_ENV = "production"
```

### Frontend Railway Config
Create `frontend/railway.toml`:
```toml
[build]
builder = "DOCKERFILE" 
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "nginx -g 'daemon off;'"
restartPolicyType = "ON_FAILURE"
```

## 🌐 Custom Domain Setup

1. **Railway Dashboard** > Your Project > Service
2. Click **"Settings"** > **"Domains"**
3. Click **"Generate Domain"** for free subdomain
4. Or add **Custom Domain** for your domain

## 📊 Monitoring & Logs

### View Logs
```bash
# Using CLI
railway logs

# Or in Dashboard
# Railway Dashboard > Service > Logs
```

### Monitoring
- **Metrics**: CPU, Memory, Network usage
- **Health Checks**: Automatic health monitoring
- **Alerts**: Set up alerts for service health

## 💰 Railway Pricing

**Free Tier:**
- $5 worth of usage credits monthly
- Perfect for development and small projects
- No credit card required

**Pro Tier:**
- $20/month for teams
- Unlimited projects
- Priority support

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **Database**: Use Railway's managed PostgreSQL
3. **HTTPS**: Automatic SSL certificates
4. **Private Networking**: Services communicate privately

## 🚀 Deployment Commands

```bash
# Full deployment workflow
git add .
git commit -m "Deploy to Railway"
git push origin main

# Railway auto-deploys on push!
```

## 🐛 Troubleshooting

### Common Issues:

**Build Failures:**
```bash
# Check build logs
railway logs --build

# Restart deployment
railway redeploy
```

**Health Check Failures:**
- Ensure health endpoints return 200 status
- Check service startup time
- Verify port configuration

**Database Issues:**
```bash
# Add PostgreSQL database
railway add postgresql

# Connect to database
railway connect postgresql
```

## 📈 Scaling

Railway automatically scales based on traffic:
- **Horizontal Scaling**: Multiple instances
- **Vertical Scaling**: More CPU/Memory
- **Auto-scaling**: Based on demand

## 🎯 Pro Tips

1. **Database**: Migrate from SQLite to PostgreSQL for production
2. **Caching**: Add Redis for better performance  
3. **CDN**: Use Railway's edge caching
4. **Monitoring**: Set up error tracking with Sentry

---

**🎉 Your Pokemon app will be live at: `https://your-service.railway.app`** 