# ZEPHYR AI Boxing App — Context

## Project Mission
A professional-grade AI Boxing Coach that uses client-side computer vision (MediaPipe) for athletic performance tracking and a secure Node.js proxy for AI strategist insights (Gemini).

## Architecture (Monorepo — 2 directories)

```
boxing-frontend/
├── backend/          # Express + TypeScript API server (Google Cloud Run)
│   └── src/server.ts # Gemini AI proxy endpoints
├── frontend/         # Vite + React + Legacy HTML hybrid
│   ├── src/          # React 18 SPA (Login + Onboarding flow)
│   ├── legacy/       # Vanilla HTML/JS/CSS pages (main app post-onboarding)
│   ├── index.html    # React entry point
│   └── vite.config.ts
├── vercel.json       # Vercel deployment config
└── .env.example      # Environment variable reference
```

## Core Stack
- **Frontend SPA**: React 18 + TypeScript + Vite + Framer Motion + Tailwind CSS
- **Frontend App Pages**: Vanilla HTML + JS + CSS (in `frontend/legacy/`)
- **Backend**: Express + TypeScript (secure Gemini API proxy)
- **Database/Auth**: Supabase (PostgreSQL + Phone OTP)
- **AI/ML**: Google Gemini (via backend proxy) + MediaPipe Pose (client-side)
- **Hosting**: Vercel (frontend) + Google Cloud Run (backend)

## Design System: "Cyber-Athletic"
- **Colors**: Neon Lime (#E2FF3B) on Deep Matte Black (#0A0A0A)
- **Aesthetics**: Glassmorphism, high-contrast typography, HUD-style overlays
