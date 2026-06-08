# 🥊 Elite Planner Integration Guide

## Overview

The **Boxing AI Planner** has been completely rebuilt from legacy HTML to a production-grade **React + Vite + TypeScript** component with **Gemini 2.5 Flash** AI-powered training plan generation.

### What Changed

**Frontend:**
- ✅ New React component: `frontend/src/pages/planner/PlannerOnboarding.tsx`
- 5-step onboarding wizard with dark theme & animations (Tailwind + Framer Motion)
- Real-time loading states with rotating AI phrases
- Full form validation & error handling

**Backend:**
- ✅ Upgraded `/api/generate-plan` endpoint in `backend/src/server.ts`
- Direct Gemini 2.5 Flash integration (no fallback needed)
- Robust prompt engineering with punch combination numbering (1=Jab, 2=Cross, etc.)
- Equipment restrictions (no bag work if shadowboxing-only)
- JSON response with 7-day structured training roadmap

**Dependencies Added:**
- `@google/generative-ai@^0.17.0` (backend)

---

## 🚀 Deployment Steps

### Step 1: Build Backend
```bash
cd backend
npm run build
```
This compiles TypeScript to `dist/server.js`

### Step 2: Deploy to Cloud Run
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/boxing-backend
gcloud run deploy boxing-backend --image gcr.io/YOUR_PROJECT/boxing-backend
```

### Step 3: Set Environment Variables
In Cloud Run deploy settings, add:
```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Or keep the fallback: `AQ.Ab8RN6IH98YjO8aKwtVto4uCKNdq9ytSuKmp1XsWvOgyCqZYUw`

### Step 4: Deploy Frontend to Vercel
```bash
cd frontend
npm run build
```
Vercel will auto-detect and deploy. Ensure `.env.production` has:
```
VITE_API_URL=https://boxing-backend-rrbvfjabvq-uc.a.run.app
```

---

## 📊 Component Architecture

### Frontend Data Flow
```
PlannerOnboarding Component (5 Steps)
    ↓
Step 1: Experience Level (novice, intermediate, advanced)
    ↓
Step 2: Focus Area (power, speed, footwork, cardio)
    ↓
Step 3: Equipment (shadowbox, jump-rope, heavy-bag, full-gym)
    ↓
Step 4: Duration (15, 30, 45, 60+ mins)
    ↓
Step 5: Frequency (light 2-3/week, moderate 4-5/week, intense 7/week)
    ↓
POST to /api/generate-plan
    ↓
Loading Phase (rotating AI phrases)
    ↓
Plan Generated → Store in localStorage → Redirect to /planner
```

### Backend Processing
```
Request Received: { experience, focus, equipment, duration, frequency }
    ↓
Validate all required fields
    ↓
Build System Instruction (Elite Boxing Headmaster persona)
    ↓
Build User Prompt (fighter metrics + constraints)
    ↓
Call Gemini 2.5 Flash API
    ↓
Parse JSON Response (clean markdown wrappers)
    ↓
Validate 7-day plan structure
    ↓
Return: { status: 'success', plan: {...} }
```

---

## 🔧 Integrating into Existing App

### Option 1: Add Route (React Router)
```tsx
import PlannerOnboarding from './pages/planner/PlannerOnboarding';

// In your router:
<Route path="/planner-setup" element={<PlannerOnboarding />} />
```

### Option 2: Conditional Render in App.tsx
```tsx
// After onboarding completes, if user hasn't generated a plan yet:
if (needsPlannerSetup && !planExists) {
    return <PlannerOnboarding />;
}
```

### Option 3: Standalone Access
User can directly access via:
- `https://yourdomain.com/planner-setup`
- Or add a navigation button that links to this route

---

## 📝 API Endpoint Specification

### POST `/api/generate-plan`

**Request:**
```json
{
  "experience": "intermediate",
  "focus": "power",
  "equipment": ["jump-rope", "heavy-bag"],
  "duration": 45,
  "frequency": "moderate",
  "user_metrics": {
    "age": 28,
    "weight": 75,
    "height": 180
  }
}
```

**Response:**
```json
{
  "status": "success",
  "plan": {
    "title": "Elite Power Protocol for Intermediate Fighter",
    "week_range": "MON JUN 8 - SUN JUN 14",
    "intensity_score": 82,
    "experience_note": "This plan builds on fundamental technique with progressive power development",
    "days": [
      {
        "day_name": "MON",
        "date": "8",
        "intensity": 75,
        "warm_up": {
          "duration": "5 MIN",
          "drills": ["Shadowbox 2 rounds", "Joint prep"]
        },
        "main_block": [
          {
            "title": "COMBINATION CHAINS",
            "combos": ["1-2", "1-2-3-2", "1-2-3-4"],
            "format": "3 rounds x 30 sec work / 15 sec rest",
            "reps": 3,
            "impact": "EXPLOSIVE POWER"
          }
        ],
        "cool_down": {
          "duration": "3 MIN",
          "recovery": "Light shadowbox + stretching"
        }
      }
      // ... 6 more days
    ],
    "weekly_focus": "Building explosive power through heavy bag combinations",
    "generated_at": "2026-06-08T14:30:00Z",
    "version": "v2.0",
    "fighter_profile": { /* echo back of input */ }
  }
}
```

**Error Response:**
```json
{
  "error": "Failed to generate training plan",
  "details": "AI response format invalid"
}
```

---

## 🧪 Testing Checklist

- [ ] **Backend Build**: `npm run build` in `backend/` completes without errors
- [ ] **Frontend Syntax**: No TypeScript errors in PlannerOnboarding.tsx
- [ ] **Gemini API**: Test with curl:
  ```bash
  curl -X POST http://localhost:8080/api/generate-plan \
    -H "Content-Type: application/json" \
    -d '{"experience":"intermediate","focus":"power","equipment":["jump-rope"],"duration":45,"frequency":"moderate"}'
  ```
- [ ] **Loading States**: 5-step UI displays correctly with animations
- [ ] **Form Validation**: Buttons disable until all fields filled
- [ ] **Error Handling**: Network errors display in red banner
- [ ] **localStorage**: Plan stored after generation
- [ ] **Redirect**: After plan generation, user can view it on planner page
- [ ] **Mobile Responsive**: Component works on phones (dark theme)

---

## 🛑 Troubleshooting

### Issue: "Missing required fields"
**Cause**: Frontend didn't send all 5 fields
**Fix**: Ensure all form steps are completed before submit

### Issue: "AI response format invalid"
**Cause**: Gemini returned non-JSON or unexpected structure
**Fix**: Check system instruction in server.ts - may need adjustment if Gemini API changed

### Issue: "502 Bad Gateway"
**Cause**: Backend not running or Gemini API key invalid
**Fix**: 
- Verify Cloud Run service is active
- Check GEMINI_API_KEY environment variable
- Check backend logs: `gcloud run logs read boxing-backend --limit 50`

### Issue: CORS errors
**Cause**: Frontend URL not in CORS whitelist
**Fix**: Backend has `cors()` enabled - should work. If not, check Cloud Run region

### Issue: Long loading times
**Cause**: Gemini API is slow (up to 30s)
**Fix**: Increase timeout in frontend if needed (currently 30s), or show longer loading message

---

## 📚 Code References

- **Frontend Component**: `frontend/src/pages/planner/PlannerOnboarding.tsx` (330 lines)
- **Backend Route**: `backend/src/server.ts` (lines 47-195)
- **System Instruction**: `backend/src/server.ts` (lines 66-101) - Customize here for different AI behavior

---

## 🎯 Next Steps

1. **Deploy Backend**: Push to Cloud Run with Gemini API key
2. **Deploy Frontend**: Vercel auto-redeploys on git push
3. **Route Setup**: Add `/planner-setup` route to App.tsx or accessible from onboarding
4. **User Testing**: Test full flow: onboarding → planner config → 5-step wizard → plan view
5. **Monitor**: Watch Cloud Run logs for Gemini API errors

---

## 📞 Support

- **Backend Logs**: `gcloud run logs read boxing-backend --limit 100`
- **Gemini Docs**: https://ai.google.dev/
- **React Docs**: https://react.dev/
- **Vercel Docs**: https://vercel.com/docs/

---

**Last Updated**: June 8, 2026  
**Version**: 2.0 (Gemini-Powered)
