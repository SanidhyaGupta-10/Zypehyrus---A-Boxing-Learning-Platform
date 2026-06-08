# 🔌 How to Integrate PlannerOnboarding into App.tsx

## Quick Integration (Option 1: Add Route Check)

In your `frontend/src/App.tsx`, add this logic to the main component render:

```tsx
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { redirectToDashboard } from './lib/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import Login from './pages/auth/Login';
import Welcome from './pages/onboarding/Welcome';
// ... other imports

import PlannerOnboarding from './pages/planner/PlannerOnboarding';  // ← ADD THIS

const GUEST_KEY = 'boxing_guest_mode';
const PLANNER_ROUTE = 'planner-setup';  // ← ADD THIS

function isOnboardingComplete(): boolean {
    // ... existing logic
}

const OnboardingFlow: React.FC = () => {
    // ... existing code
};

const AppGate: React.FC = () => {
    const { session, loading } = useAuth();
    const isGuest = localStorage.getItem(GUEST_KEY) === 'true';
    const [currentRoute, setCurrentRoute] = useState<string | null>(null);

    // ← ADD: Check if user is trying to access planner setup
    useEffect(() => {
        const route = window.location.pathname.split('/').filter(Boolean)[0];
        setCurrentRoute(route);
    }, []);

    useEffect(() => {
        if (!loading && (session || isGuest) && isOnboardingComplete()) {
            // Only redirect if NOT accessing planner setup
            if (currentRoute !== PLANNER_ROUTE) {
                redirectToDashboard();
            }
        }
    }, [session, loading, isGuest, currentRoute]);

    if (loading) {
        return (
            <div id="auth-loading-screen" style={{ /* existing styles */ }}>
                {/* existing loading UI */}
            </div>
        );
    }

    // ← ADD: Route to planner component
    if (currentRoute === PLANNER_ROUTE) {
        return <PlannerOnboarding />;
    }

    // Existing auth flows
    if (!session && !isGuest) {
        return <Login />;
    }

    if (!isOnboardingComplete()) {
        return <OnboardingFlow />;
    }

    return null;
};

function App() {
    return (
        <AuthProvider>
            <OnboardingProvider>
                <AppGate />
            </OnboardingProvider>
        </AuthProvider>
    );
}

export default App;
```

---

## Access Points

### From Onboarding (After Metrics Collected)
In the last onboarding step (Promise.tsx), add a button:

```tsx
<button 
    onClick={() => window.location.href = '/planner-setup'}
    className="btn-primary"
>
    SETUP YOUR ELITE PLAN →
</button>
```

### From Dashboard
Add a "Generate Training Plan" card:

```tsx
<motion.button
    onClick={() => window.location.href = '/planner-setup'}
    className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
>
    <Zap size={32} className="text-primary mb-2" />
    <h3 className="text-lg font-bold text-white">Generate Elite Plan</h3>
    <p className="text-xs text-white/60">Customize your 7-day roadmap</p>
</motion.button>
```

### From Planner Page
When user hasn't generated a plan yet:

```tsx
// In planner.html or as React component:
if (!planExists) {
    window.location.href = '/planner-setup';
}
```

---

## Environment Setup

### 1. Vercel Environment Variables
Set these in Vercel project settings:

```env
VITE_API_URL=https://boxing-backend-rrbvfjabvq-uc.a.run.app
VITE_SUPABASE_URL=https://myhuargasktsrvgdrejy.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_key_here
```

### 2. Backend Environment Variables
Set in Cloud Run environment:

```env
GEMINI_API_KEY=your_gemini_key_here
PORT=8080
```

---

## Testing the Integration

### Local Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Visit: http://localhost:5173/planner-setup
```

### Production
```bash
# Make sure /planner-setup route works:
# https://yourapp.vercel.app/planner-setup

# Test with curl:
curl -X POST https://boxing-backend-rrbvfjabvq-uc.a.run.app/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "experience": "intermediate",
    "focus": "power",
    "equipment": ["jump-rope"],
    "duration": 45,
    "frequency": "moderate"
  }'
```

---

## Styling Notes

The component uses:
- **Tailwind CSS**: Dark theme with primary color accent (defaults to orange/gold)
- **Framer Motion**: Step transitions & animations
- **Lucide React**: Icons (already used in app)
- **Custom CSS Variables**: Uses `--primary-rgb` for dynamic color

Ensure your `index.css` or `tailwind.config.js` defines:

```css
:root {
  --primary-rgb: 255, 127, 0; /* Your primary color RGB */
  --primary-color: rgb(255, 127, 0); /* Same as above */
}
```

Or in `tailwind.config.js`:

```js
theme: {
  colors: {
    primary: 'rgb(255, 127, 0)',
  }
}
```

---

## Data Flow After Plan Generation

```
1. User completes 5-step wizard
2. Component POSTs to /api/generate-plan
3. Backend calls Gemini AI
4. Response stored: localStorage['active_boxing_plan_v2']
5. Also stored: localStorage['last_plan_gen_date_v2']
6. Component redirects: window.location.href = '/planner'
7. Planner page reads localStorage and displays plan
```

---

## Troubleshooting Integration

### "Component not found" error
- Verify path: `frontend/src/pages/planner/PlannerOnboarding.tsx` exists
- Check import: `import PlannerOnboarding from './pages/planner/PlannerOnboarding'`

### Route not working
- Ensure window.location.pathname parsing works (test in browser console)
- Or use React Router if available

### Styling looks wrong
- Check Tailwind CSS is built correctly
- Verify primary color CSS variables exist
- Import `framer-motion` package

### API calls failing
- Check VITE_API_URL is correct
- Verify backend is running: `curl https://your-backend/health`
- Check CORS headers in backend

---

**Next**: Deploy to Vercel and test end-to-end flow!
