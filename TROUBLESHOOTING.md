# Troubleshooting Guide

## Frontend Not Connecting to Backend

### Symptoms
- "Login failed" or "Cannot connect to server" errors
- API requests failing
- CORS errors in browser console

### Step 1: Check Environment Variables

**In Render (Frontend):**
1. Go to your Render dashboard → Your site → Environment
2. Verify `VITE_API_URL` is set to your Fly.io backend URL
3. Format: `https://your-app.fly.dev` (must include `https://`)
4. **Important:** After changing environment variables, you must **rebuild** the site

**In Fly.io (Backend):**
1. Check secrets: `fly secrets list`
2. Verify `FRONTEND_URL` is set to your Render frontend URL
3. Format: `https://your-app.onrender.com` (must include `https://`)

### Step 2: Verify URLs

**Check Frontend API URL:**
1. Open browser console (F12)
2. Look for log: `API Base URL: https://...`
3. If it shows `/api` instead of full URL, the environment variable is not set

**Check Backend CORS:**
1. Check Fly.io logs: `fly logs`
2. Look for CORS warnings or errors
3. Verify the origin matches your Render URL

### Step 3: Test Backend Directly

```bash
# Test health endpoint
curl https://your-backend.fly.dev/api/health

# Test login endpoint
curl -X POST https://your-backend.fly.dev/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the failed request:
   - What URL is it trying to hit?
   - What's the error message?
   - Is it a CORS error or connection error?

### Common Issues

#### Issue 1: Environment Variable Not Set
**Symptom:** API Base URL shows `/api` in console
**Fix:** 
- Set `VITE_API_URL` in Render dashboard
- Rebuild the site in Render

#### Issue 2: CORS Error
**Symptom:** Browser console shows CORS error
**Fix:**
- Update `FRONTEND_URL` in Fly.io secrets
- Make sure it matches your Render URL exactly
- Redeploy backend: `fly deploy`

#### Issue 3: Wrong Protocol
**Symptom:** Mixed content errors
**Fix:**
- Use `https://` for both frontend and backend URLs
- Never use `http://` in production

#### Issue 4: Backend Not Running
**Symptom:** Connection timeout or "Cannot connect"
**Fix:**
- Check Fly.io status: `fly status`
- Check logs: `fly logs`
- Restart if needed: `fly apps restart your-app-name`

### Quick Debugging Commands

```bash
# Check Fly.io secrets
fly secrets list

# Check Fly.io status
fly status

# View logs
fly logs

# Test backend health
curl https://your-backend.fly.dev/api/health

# Update CORS
fly secrets set FRONTEND_URL=https://your-frontend.onrender.com
fly deploy
```

### Still Not Working?

1. Check browser console for detailed error messages
2. Check Fly.io logs for backend errors
3. Verify both services are deployed and running
4. Ensure environment variables are set correctly
5. Make sure you rebuilt the frontend after setting environment variables

