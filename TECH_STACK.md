# 🥊 ZEPHYR AI Boxing App — Tech Stack

> Accurate as of cleanup on 2026-06-21. Only working, deployed technologies listed.

---

## 🏗️ Architecture

```
boxing-frontend/
├── backend/                    # Express + TypeScript API server
│   ├── src/server.ts           # Gemini AI proxy (Cloud Run)
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Vite + React + Legacy HTML hybrid
│   ├── src/                    # React 18 SPA (onboarding)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── context/            # AuthContext, OnboardingContext
│   │   ├── lib/                # supabaseClient.ts, api.ts, navigation.ts
│   │   └── pages/              # auth/, onboarding/, planner/
│   ├── legacy/                 # Vanilla HTML/JS/CSS app pages
│   │   ├── dashboard.html      # Home / Today's Mission
│   │   ├── training.html       # Daily Grind (workout list)
│   │   ├── session-timer.html  # Active drill timer
│   │   ├── guru.html           # Combat Guru (technique library)
│   │   ├── planner.html        # AI Weekly Planner
│   │   ├── vision-analyser.html # AI live form analyser
│   │   ├── reflex-enhancer.html # Reflex training games
│   │   ├── analytics.html      # Performance analytics
│   │   ├── leaderboard.html    # Global streak leaderboard
│   │   ├── settings.html       # User profile & settings
│   │   ├── style.css           # Global design system CSS
│   │   └── ... (30+ HTML pages, 15+ JS modules)
│   ├── index.html              # React SPA entry point
│   ├── vite.config.ts          # Vite build + legacy file plugin
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
├── vercel.json                 # Vercel deployment config
└── .env.example                # Environment variable reference
```

---

## ⚛️ Frontend — React SPA (Onboarding + Auth)

| Library | Version | Purpose |
|---|---|---|
| **React** | 18.3.1 | Component framework |
| **React DOM** | 18.3.1 | DOM rendering |
| **TypeScript** | 5.4.5 | Type safety |
| **Vite** | 5.2.11 | Build tool & dev server |
| **@vitejs/plugin-react** | 4.2.1 | React fast-refresh for Vite |
| **Framer Motion** | 11.2.4 | Page transition animations |
| **Lucide React** | 0.379.0 | Icon library |
| **Tailwind CSS** | 3.4.19 | Utility CSS for React pages |
| **PostCSS** | 8.5.15 | CSS processing pipeline |
| **Autoprefixer** | 10.5.0 | Browser compatibility prefixes |
| **@supabase/supabase-js** | 2.43.2 | Supabase client (auth + DB) |

### React Pages
- `pages/auth/Login.tsx` — Phone OTP + guest login
- `pages/onboarding/*.tsx` — 16-step onboarding flow (Welcome → Calibration → Launch)
- `pages/planner/PlannerOnboarding.tsx` — AI planner setup
- `context/AuthContext.tsx` — Supabase auth state
- `context/OnboardingContext.tsx` — Onboarding step state

---

## 📄 Frontend — Legacy HTML/JS/CSS (Main App Pages)

| Technology | Source |
|---|---|
| **HTML5 + Vanilla JS + CSS** | Hand-written, no framework |
| **Font Awesome** | 6.4.0 (CDN) |
| **MediaPipe Pose** | Client-side body tracking (CDN) |
| **Supabase JS** | CDN import in HTML pages |

### Key JS Modules (in `frontend/legacy/`)
| File | Purpose |
|---|---|
| `workout-data.js` | Daily workout generation |
| `streak-manager.js` | Streak tracking + Supabase sync |
| `techniques-data.js` | Static technique catalog |
| `guru-media.js` | Technique normalization + SVG placeholders |
| `planner.js` | AI planner logic with proxy + direct fallback |
| `planner-gemini.js` | Client-side Gemini API caller |
| `planner-plan-builder.js` | Plan builder UI logic |
| `leaderboard-manager.js` | Leaderboard fetch & render |
| `auth.js` | Supabase auth wrapper |
| `user-profile.js` | Profile avatar loading |
| `sound-effects.js` | UI sound engine |
| `notification-manager.js` | Push notification scheduling |
| `vision-gemini-init.js` | Vision analyser Gemini init |
| `protocol-session-utils.js` | Planner protocol session state |
| `onboarding-utils.js` | Onboarding helpers |

---

## 🖥️ Backend — Node.js API Server

| Library | Version | Purpose |
|---|---|---|
| **Express** | 4.19.2 | HTTP server + REST API |
| **TypeScript** | 5.4.5 | Type safety |
| **@google/generative-ai** | 0.17.2 | Gemini AI SDK |
| **cors** | 2.8.5 | CORS middleware |
| **helmet** | 7.1.0 | Security headers |
| **dotenv** | 16.4.5 | Environment variables |
| **tsx** | 4.7.2 | TypeScript execution (dev) |

### API Endpoints (`backend/src/server.ts`)
| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/analyze-session` | Session metrics → Gemini analysis |
| `POST` | `/api/generate-plan` | User profile → 7-day training roadmap |
| `GET` | `/health` | Health check |

---

## 🗄️ Database & Auth — Supabase

| Service | Purpose |
|---|---|
| **PostgreSQL** | Primary database (profiles, leaderboard, techniques) |
| **Auth** | Phone OTP login (SMS), session management |
| **Realtime** | Live leaderboard updates |

### Tables
| Table | Contents |
|---|---|
| `profiles` | User onboarding data, ring name, metrics |
| `leaderboard_streaks` | Streak scores for global leaderboard |
| `techniques` | Custom user-added combat techniques |

---

## 🤖 AI & Machine Learning

| Technology | Purpose | Where |
|---|---|---|
| **Google Gemini 2.5 Flash** | Training plan generation, coaching | Backend proxy |
| **MediaPipe Pose** | Real-time boxing form tracking | Client-side (browser) |

---

## 🚀 Hosting & Deployment

| Service | What | Config |
|---|---|---|
| **Vercel** | Frontend static hosting | `vercel.json` |
| **Google Cloud Run** | Backend API server | `backend/Dockerfile` |
| **Docker** | Backend containerization | `backend/Dockerfile` |

### Vercel Build
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`

---

## 🔑 Environment Variables

| Variable | Where Set | Used By |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel / `.env.local` | Frontend Supabase client |
| `VITE_SUPABASE_ANON_KEY` | Vercel / `.env.local` | Frontend Supabase client |
| `GEMINI_API_KEY` | Cloud Run / `.env` | Backend Gemini proxy |
| `PORT` | Cloud Run | Backend server |

---

## 🎨 Design System

- **Theme**: "Cyber-Athletic" dark mode
- **Primary**: `#E2FF3B` (Neon Lime)
- **Background**: `#0A0A0A` (Deep Matte Black)
- **Icons**: Font Awesome 6.4.0 (CDN) + Lucide React (onboarding)
- **Effects**: Glassmorphism, conic-gradient rings, HUD overlays, glow shadows
- **Main CSS**: `frontend/legacy/style.css`
