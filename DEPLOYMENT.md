# Deployment Guide - Render (Frontend) + Fly.io (Backend)

This guide will help you deploy the College SaaS application using Render for the frontend and Fly.io for the backend.

## Prerequisites

- GitHub account
- Render account (free tier available)
- Fly.io account (free tier available)
- Supabase account and project

## Part 1: Deploy Backend to Fly.io

### Step 1: Install Fly.io CLI

```bash
# macOS
brew install flyctl

# Linux/Windows
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login to Fly.io

```bash
fly auth login
```

### Step 3: Initialize Fly.io App

```bash
cd backend
fly launch
```

When prompted:
- App name: `college-saas-api` (or your preferred name)
- Region: Choose closest to your users
- PostgreSQL: No (we're using Supabase)
- Redis: No

### Step 4: Configure Environment Variables

```bash
fly secrets set NODE_ENV=production
fly secrets set JWT_SECRET=$(openssl rand -base64 32)
fly secrets set SUPABASE_URL=https://your-project.supabase.co
fly secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
fly secrets set FRONTEND_URL=https://your-render-app.onrender.com
```

Or set them all at once:

```bash
fly secrets set \
  NODE_ENV=production \
  JWT_SECRET=$(openssl rand -base64 32) \
  SUPABASE_URL=https://your-project.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  FRONTEND_URL=https://your-render-app.onrender.com
```

### Step 5: Deploy

```bash
fly deploy
```

### Step 6: Get Your Backend URL

After deployment, you'll get a URL like: `https://college-saas-api.fly.dev`

Note this URL - you'll need it for the frontend configuration.

## Part 2: Deploy Frontend to Render

### Step 1: Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Select the repository

### Step 2: Configure Build Settings

- **Name**: `college-saas-frontend` (or your preferred name)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 3: Add Environment Variables

In Render dashboard, go to Environment section and add:

```
VITE_API_URL=https://college-saas-api.fly.dev
VITE_NODE_ENV=production
```

### Step 4: Deploy

Click "Create Static Site" and Render will:
1. Install dependencies
2. Build the frontend
3. Deploy to a CDN

### Step 5: Get Your Frontend URL

After deployment, you'll get a URL like: `https://college-saas-frontend.onrender.com`

## Part 3: Update CORS Settings

After getting your frontend URL, update the backend CORS:

```bash
cd backend
fly secrets set FRONTEND_URL=https://your-render-app.onrender.com
fly deploy
```

## Part 4: Database Setup

### Step 1: Run Database Migrations

1. Go to your Supabase SQL Editor
2. Run the schema: Copy and paste `backend/database/schema.sql`
3. Run migrations if needed:
   - `backend/database/migration_remove_code.sql`
   - `backend/database/migration_add_roles.sql` (run step by step)

### Step 2: Create First SuperAdmin

SSH into your Fly.io app and run:

```bash
fly ssh console
cd /app
npm run create-superadmin admin@yourdomain.com yourpassword "Admin Name"
```

Or run locally with Fly.io secrets:

```bash
cd backend
# Set local env vars from Fly.io
fly secrets list
# Copy the values and set locally, then:
npm run create-superadmin admin@yourdomain.com yourpassword "Admin Name"
```

## Part 5: Verify Deployment

1. **Check Backend Health:**
   ```bash
   curl https://college-saas-api.fly.dev/api/health
   ```

2. **Check Frontend:**
   - Visit your Render URL
   - Try logging in as SuperAdmin

3. **Test API Connection:**
   - Open browser console on frontend
   - Check for any CORS or API errors

## Troubleshooting

### Backend Issues

**Check logs:**
```bash
fly logs
```

**SSH into app:**
```bash
fly ssh console
```

**Restart app:**
```bash
fly apps restart college-saas-api
```

### Frontend Issues

**Check build logs:**
- Go to Render dashboard → Your site → Logs

**Common issues:**
- Build fails: Check `package.json` scripts
- API not connecting: Verify `VITE_API_URL` is correct
- CORS errors: Update `FRONTEND_URL` in Fly.io secrets

### Database Issues

- Verify Supabase credentials in Fly.io secrets
- Check Supabase dashboard for connection issues
- Ensure migrations ran successfully

## Updating Your Deployment

### Update Backend

```bash
cd backend
git add .
git commit -m "Update backend"
git push
fly deploy
```

### Update Frontend

```bash
cd frontend
git add .
git commit -m "Update frontend"
git push
# Render will auto-deploy on push
```

## Custom Domains

### Fly.io Custom Domain

```bash
fly certs add yourdomain.com
# Follow DNS instructions
```

### Render Custom Domain

1. Go to Render dashboard → Your site → Settings
2. Click "Add Custom Domain"
3. Follow DNS configuration instructions

## Monitoring

### Fly.io

```bash
# View metrics
fly status

# View logs
fly logs

# Monitor
fly dashboard
```

### Render

- View logs in Render dashboard
- Set up uptime monitoring
- Configure alerts

## Cost Estimation

### Fly.io (Backend)
- Free tier: 3 shared-cpu-1x VMs
- Paid: ~$5-10/month for better performance

### Render (Frontend)
- Free tier: Static sites are free
- Paid: $7/month for custom domains and better performance

## Security Checklist

- [ ] Strong JWT_SECRET set
- [ ] Supabase service role key is secure
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] Environment variables not exposed
- [ ] Database migrations completed
- [ ] First SuperAdmin created

## Support

- Fly.io Docs: https://fly.io/docs
- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs
