# 🥊 AI Boxing Guru — Full Tech Stack & Infrastructure

> Living reference document. Update this file whenever a new tool, service, or dependency is added.

---

## 🏗️ Architecture Overview

> Repo local path: `E:\boxing app\app project`

```
┌─────────────────────────────────────────────────────┐
│                   USER (Browser / PWA)               │
└───────────────────┬─────────────────────────────────┘
                    │ HTTPS
        ┌───────────▼────────────┐
        │   Vercel (Frontend)    │  ← Static HTML/JS + React SPA
        │   boxing-frontend repo │
        └───────────┬────────────────────┘
                    │ REST / Realtime
        ┌───────────▼────────────┐      ┌──────────────────────┐
        │   Supabase (BaaS)      │      │  Google Cloud Run    │
        │   Auth + PostgreSQL    │      │  (Gemini AI Proxy)   │
        │   + Realtime + Storage │      │  Node.js server.js   │
        └────────────────────────┘      └──────────────────────┘
```

---

## 🌐 Hosting & Deployment

### Vercel — Frontend Hosting
- **URL**: Linked to `https://github.com/Subham231/boxing-frontend`
- **Branch**: `main` (auto-deploys on every push)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Config File**: [`vercel.json`](./vercel.json)
- **What it serves**: All static `.html` pages + the React/Vite SPA (onboarding flow), including a goal-selection onboarding step with back navigation to prevent getting stuck.

### Google Cloud Run — Backend AI Proxy
- **Purpose**: Secure proxy that holds the Gemini API key server-side (never exposed to the browser)
- **Runtime**: Node.js
- **Entry Point**: [`server.js`](./server.js) (also copied to `frontend/dist/server.js`)
- **Key Endpoints**:
  - `POST /api/gemini` — Forwards prompts to Google Gemini API
  - `GET /health` — Health check endpoint
- **Config**: [`cloudbuild.yaml`](./cloudbuild.yaml)

---

## 🗄️ Database & Auth

### Supabase
- **Role**: Backend-as-a-Service (BaaS)
- **Services used**:
  | Service | Purpose |
  |---------|---------|
  | **PostgreSQL** | Primary database (profiles, leaderboard, techniques) |
  | **Auth** | Phone OTP login (via SMS), session management |
  | **Realtime** | Live leaderboard updates |
  | **Storage** | User avatar/media (planned) |
- **Client files**:
  - [`supabase-client.js`](./supabase-client.js) — Legacy HTML pages ESM client
  - [`frontend/src/lib/supabaseClient.ts`](./frontend/src/lib/supabaseClient.ts) — React/TS singleton
- **Auth flow**: Phone number → OTP SMS → Session token → `localStorage` flag
- **Tables**:
  | Table | Contents |
  |-------|---------|
  | `profiles` | User onboarding data, ring name, metrics |
  | `leaderboard_streaks` | Streak scores for global leaderboard |
  | `techniques` | Custom user-added combat techniques |
- **Environment Variables** (set in Vercel dashboard):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

---

## 🤖 AI & Machine Learning

### Google Gemini API
- **Model**: Gemini 1.5 Flash (via backend proxy)
- **Used in**:
  - **AI Planner** (`planner.js`) — Generates personalised weekly training plans
  - **Combat Guru** (`guru.html`) — Technique coaching & advice
- **Files**:
  - [`planner-gemini.js`](./planner-gemini.js) — Client-side Gemini caller
  - [`planner.js`](./planner.js) — Plan builder logic with proxy + direct fallback
- **Fallback**: If the backend proxy times out (>30s) or returns 429, the client attempts a direct API call via `window.PlannerGemini`

### MediaPipe Pose
- **Purpose**: Real-time boxing form analysis via webcam
- **Used in**: [`vision-analyser.html`](./vision-analyser.html)
- **Mode**: Fully client-side (no server needed for inference)
- **Initialiser**: [`vision-gemini-init.js`](./vision-gemini-init.js)

---

## ⚛️ Frontend Framework (React SPA — Onboarding)

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18.3.1 | Component framework |
| **Vite** | 5.2.11 | Build tool & dev server |
| **TypeScript** | 5.4.5 | Type safety |
| **Framer Motion** | 11.2.4 | Page transition animations |
| **Lucide React** | 0.379.0 | Icon library |
| **Tailwind CSS** | 3.4.19 | Utility CSS (onboarding pages only) |
| **@supabase/supabase-js** | 2.43.2 | Supabase JS client |

- **Entry point**: `frontend/src/main.tsx`
- **Config**: [`frontend/vite.config.ts`](./frontend/vite.config.ts)
- **Key vite plugin**: `legacyAppPlugin` — copies all root `.html`/`.js`/`.css` files into `frontend/dist` on every build

---

## 📄 Legacy HTML App (Main App Pages)

The core app (post-onboarding) is built with **plain HTML + Vanilla JS + CSS**:

| File | Page |
|------|------|
| `dashboard.html` | Home / Today's Mission |
| `training.html` | Daily Grind (workout list) |
| `session-timer.html` | Active drill timer |
| `guru.html` | Combat Guru (technique library) |
| `technical-detail.html` | Technique deep-dive |
| `planner.html` | AI Weekly Planner |
| `reflex-enhancer.html` | Reflex training games |
| `vision-analyser.html` | AI live form analyser |
| `analytics.html` | Performance analytics |
| `leaderboard.html` | Global streak leaderboard |
| `settings.html` | User profile & settings |

### Shared JS Modules (loaded via `<script src="">`)
| File | Purpose |
|------|---------|
| `workout-data.js` | `getDailyWorkout()` — generates personalised daily drills |
| `streak-manager.js` | Streak tracking, badge updates, Supabase sync |
| `techniques-data.js` | Static technique catalog (stances/punches/kicks/defense) |
| `guru-media.js` | Technique normalization, SVG placeholder images |
| `sound-effects.js` | UI click/success sound engine |
| `notification-manager.js` | Push notification scheduling |
| `user-profile.js` | Profile avatar loading |
| `leaderboard-manager.js` | Leaderboard fetch & render helpers |
| `auth.js` | Supabase auth wrapper (ES module, used via `import`) |
| `protocol-session-utils.js` | Planner protocol session state |

---

## 💾 State & Storage

| Storage | What's stored |
|---------|--------------|
| `localStorage` | Onboarding data, workout progress, streak, settings, custom techniques, reflex baseline |
| `Supabase DB` | Profiles, leaderboard scores, cloud-synced techniques |
| URL params | Drill index, session source, planner day/protocol index |

### Key localStorage Keys
| Key | Purpose |
|-----|---------|
| `boxing_onboarding_data` | Full onboarding JSON (name, metrics, goals, etc.) |
| `boxing_guru_logged_in` | Auth session flag |
| `boxing_streak_data` | `{ currentStreak, lastCompletedDate }` |
| `workout_progress_[DATE]` | Array of completed drill indices for a given day |
| `deployed_planner_drills_[DATE]` | AI-generated planner drills injected into daily grind |
| `custom_techniques` | User-added techniques (localStorage fallback) |
| `reflex_assessment_done` | Whether calibration was completed |
| `reflex_baseline_avg` | Average reaction time in ms |
| `active_boxing_plan_v2` | Full AI-generated weekly plan |
| `app_settings` | `{ stealth: bool }` |

---

## 🎨 Design System

- **Theme**: "Cyber-Athletic" dark mode
- **Primary Color**: `#E2FF3B` (Neon Lime) — `--primary`
- **Background**: `#0A0A0A` (Deep Matte Black)
- **Fonts**: System UI / inherited (no external font CDN)
- **Icons**: Font Awesome 6.4.0 (CDN)
- **Effects**: Glassmorphism, conic-gradient rings, HUD overlays, glow shadows
- **Main CSS**: [`style.css`](./style.css)

---

## 📱 PWA & Mobile

- **Manifest**: `/manifest.json`
- **iOS support**: `apple-mobile-web-app-capable` meta tags
- **Fullscreen**: Auto-enters fullscreen on first touch/click
- **Capacitor config**: `capacitor.config.json` (for future native app wrapping)

---

## 🔑 Environment Variables Reference

| Variable | Where set | Used by |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | Vercel dashboard | `supabase-client.js`, `supabaseClient.ts` |
| `VITE_SUPABASE_ANON_KEY` | Vercel dashboard | same |
| `GEMINI_API_KEY` | Google Cloud secret / env | `server.js` backend proxy |
| `PORT` | Google Cloud Run | `server.js` |

---

## 🔁 CI/CD Flow

```
Developer pushes to main
        │
        ▼
GitHub (boxing-frontend)
        │
        ├──▶ Vercel auto-deploy
        │       cd frontend && npm install && npm run build
        │       → copies all root HTML/JS to frontend/dist
        │       → deploys frontend/dist as static site
        │
        └──▶ Google Cloud Build (manual trigger or cloudbuild.yaml)
                → builds Docker image with server.js
                → deploys to Cloud Run
```

---

## 📦 Repository Structure

```
boxing-frontend/
├── frontend/               # Vite/React SPA (onboarding)
│   ├── src/
│   │   ├── pages/          # React page components
│   │   ├── context/        # AuthContext, OnboardingContext
│   │   ├── lib/            # supabaseClient.ts, api.ts
│   │   └── main.tsx
│   ├── dist/               # Build output (deployed to Vercel)
│   ├── vite.config.ts
│   └── package.json
├── dashboard.html          # Main app pages (legacy HTML)
├── guru.html
├── training.html
├── ... (all other .html pages)
├── workout-data.js         # Shared JS modules
├── techniques-data.js
├── guru-media.js
├── streak-manager.js
├── auth.js                 # Supabase auth wrapper
├── supabase-client.js      # Supabase ESM client
├── server.js               # Google Cloud Run backend
├── style.css               # Global design system
├── vercel.json             # Vercel build config
├── cloudbuild.yaml         # Google Cloud Build config
├── AI_CONTEXT.md           # AI agent project state
└── TECH_STACK.md           # ← This file
```
