# Vercel Deployment Setup

## Required Environment Variables

Set these in your Vercel project settings (Project → Settings → Environment Variables):

### Supabase Configuration
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Gemini API (Optional - fallback provided)
```
VITE_GEMINI_API_KEY=your-gemini-key
```

### Backend API (if using separate backend)
```
VITE_API_URL=https://your-backend.vercel.app
```

## Setup Instructions

1. Go to https://vercel.com/dashboard
2. Select your boxing-frontend project
3. Click "Settings" → "Environment Variables"
4. Add each variable above
5. Redeploy the project

## Getting Credentials

### Supabase
1. Visit https://app.supabase.com
2. Create a new project or select existing
3. Go to Project Settings → API
4. Copy `URL` and `anon public` key

### Gemini API Key
1. Visit https://aistudio.google.com/apikey
2. Create API key
3. Set in Vercel as `VITE_GEMINI_API_KEY`

## Troubleshooting

### "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
- This means environment variables aren't set on Vercel
- The app will work with degraded functionality (no database sync)
- Set the variables above and redeploy

### Manifest 401 Unauthorized
- This is expected if manifest.json is being served from a CDN
- The app will still work as a progressive web app
- If it persists, check Vercel deployment logs

### Build Syntax Errors
- Clear Vercel cache and redeploy
- Check that all files were committed to Git
- Verify package.json has all dependencies
