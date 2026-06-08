# Vercel Deployment Setup

## Required Environment Variables

Set these in your Vercel project settings (Project → Settings → Environment Variables):

### Supabase Configuration
```
VITE_SUPABASE_URL=https://myhuargasktsrvgdrejy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aHVhcmdhc2t0c3J2Z2RyZWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODkyNjIsImV4cCI6MjA5NTI2NTI2Mn0.qXupqHmZS1LRCNRMLop026OFSmvlfamXlfMzThf4tFs
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aHVhcmdhc2t0c3J2Z2RyZWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODkyNjIsImV4cCI6MjA5NTI2NTI2Mn0.qXupqHmZS1LRCNRMLop026OFSmvlfamXlfMzThf4tFs
```

### Backend API
```
VITE_API_URL=https://boxing-backend-rrbvfjabvq-uc.a.run.app
```

### Gemini API (Optional - fallback provided)
```
VITE_GEMINI_API_KEY=your-gemini-key
```

## Setup Instructions

1. Go to https://vercel.com/dashboard
2. Select your **boxing-frontend** project
3. Click "Settings" → "Environment Variables"
4. Add each variable below with its value (copy-paste from `.env.example`)
5. Ensure all 4 are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_KEY`)
   - `VITE_API_URL`
   - `VITE_BACKEND_URL` (optional, but recommended)
6. Click "Save"
7. Go to "Deployments" and click the latest deployment
8. Click "Redeploy" button and select "Force Build"
9. Wait for build to complete (2-5 minutes)

## Vercel Environment Variables (Copy-Paste Ready)

**Add these one by one in Vercel Settings:**

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://myhuargasktsrvgdrejy.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aHVhcmdhc2t0c3J2Z2RyZWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODkyNjIsImV4cCI6MjA5NTI2NTI2Mn0.qXupqHmZS1LRCNRMLop026OFSmvlfamXlfMzThf4tFs` |
| `VITE_API_URL` | `https://boxing-backend-rrbvfjabvq-uc.a.run.app` |
| `VITE_BACKEND_URL` | `https://boxing-backend-rrbvfjabvq-uc.a.run.app` |

## Getting Credentials

### Supabase (Already Set)
- **URL**: https://myhuargasktsrvgdrejy.supabase.co
- **Anon Key**: Already configured above

### Backend API (Already Set)
- **URL**: https://boxing-backend-rrbvfjabvq-uc.a.run.app
- Auto-deploys from this repository

### Gemini API Key
1. Visit https://aistudio.google.com/apikey
2. Create API key (optional - fallback provided)
3. Set in Vercel as `VITE_GEMINI_API_KEY`

## Troubleshooting

### "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
- **Cause**: Environment variables not set in Vercel
- **Fix**: Add all 4 environment variables above, then force redeploy
- **Check**: Open browser DevTools Console to verify errors are gone

### Manifest 401 Unauthorized
- **Status**: This is normal/expected
- **Why**: CDN cache behavior, doesn't affect app functionality
- **Fix**: No action needed - app works as progressive web app

### Planner Shows "Synthesizing Protocol..." Forever
- **Cause**: Backend API not reachable or Gemini API key missing
- **Fix**: 
  1. Verify `VITE_API_URL` is set to backend URL
  2. Check backend logs: https://console.cloud.google.com (Cloud Run)
  3. Try the planner after onboarding setup (metrics + config required)

### Dashboard/Guru Shows No Data
- **Cause**: Supabase credentials missing or wrong
- **Fix**: Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- **Test**: Open DevTools → Application → LocalStorage → check for `boxing_onboarding_data`

### Build Failed with Syntax Error
- **Cause**: Stale Vercel cache
- **Fix**: 
  1. Go to Vercel → Deployments
  2. Click the latest deployment
  3. Click "Redeploy" → "Force Build"
  4. Wait 2-5 minutes for build to complete

### Still Having Issues?
1. Check Vercel Build Logs: Deployments → Click deployment → Logs
2. Clear browser cache: DevTools → Application → Clear storage → Reload
3. Verify all 4 environment variables are actually set in Vercel (not just in `.env.example`)
