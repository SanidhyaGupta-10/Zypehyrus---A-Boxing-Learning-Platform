# LEADERBOARD SETUP GUIDE

## Overview
This guide helps you set up the Supabase leaderboard system for the Boxing App.

## What's Been Done ✓

### 1. Fixed VISION ANALYSER Formatting
- **File**: [vision-analyser.html](vision-analyser.html)
- **Changes**:
  - Updated `.score-row` CSS from `display: flex` to `display: grid`
  - Added responsive grid layout with `grid-template-columns: repeat(auto-fit, minmax(80px, 1fr))`
  - Added mobile breakpoint for 2-column layout on small screens
  - Added text wrapping and overflow handling
  - Removed inline `grid-template-columns` style from HTML

### 2. Created Leaderboard Infrastructure
- **SQL Migration**: [supabase/migrations/001_create_leaderboards.sql](supabase/migrations/001_create_leaderboards.sql)
  - Creates three leaderboard tables:
    - `leaderboard_reflex` - Fastest reaction times (lower score = better)
    - `leaderboard_streaks` - Consecutive training days (higher = better)
    - `leaderboard_combo` - Combo points per level (higher = better)
  - Includes proper indexes for performance
  - Row-level security policies configured

- **Leaderboard Manager**: [leaderboard-manager.js](leaderboard-manager.js)
  - Global `LeaderboardManager` object for managing leaderboard operations
  - Methods:
    - `updateReflexScore(ms, supabase)` - Uploads reflex times
    - `updateStreakScore(days, supabase)` - Uploads streak days
    - `updateComboScore(pts, supabase)` - Uploads combo points
    - `getLeaderboard(supabase, table, ascending, limit)` - Fetches leaderboard
    - `getUserRank(supabase, table, ascending)` - Gets user's rank

### 3. Integrated Score Syncing
- **Vision Analyser**: [vision-analyser.html](vision-analyser.html)
  - Added leaderboard-manager.js script tag
  - After vision session completes:
    - Calculates average reflex time from drill data
    - Syncs to `leaderboard_reflex` via `LeaderboardManager.updateReflexScore()`
  - In `saveSessionToHistory()`:
    - Syncs streak days to `leaderboard_streaks`

### 4. Leaderboard Display
- **Leaderboard Page**: [leaderboard.html](leaderboard.html)
  - Already implemented with proper data fetching
  - Three tabs: Reflex | Streak | Combo
  - Shows top 100 players with medals (#1-3 get 🥇🥈🥉)
  - Highlights current user with neon background
  - Displays rank badges for streak leaderboard

---

## NEXT STEPS: Set Up Supabase Tables

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your Boxing App project
3. Navigate to **SQL Editor**

### Step 2: Run the Migration
1. Click **New Query**
2. Copy the entire SQL from [supabase/migrations/001_create_leaderboards.sql](supabase/migrations/001_create_leaderboards.sql)
3. Paste it into the SQL editor
4. Click **Run**

Expected output: Three tables created with indexes and RLS policies enabled

### Step 3: Verify Tables
In the Supabase dashboard:
1. Go to **Table Editor**
2. You should see:
   - `leaderboard_reflex`
   - `leaderboard_streaks`
   - `leaderboard_combo`
3. Click each table to verify columns:
   - `id` (UUID, auto-generated)
   - `name` (TEXT, unique)
   - `score` (FLOAT for reflex/combo, INTEGER for streaks)
   - `display_val` (TEXT)
   - `last_updated` (TIMESTAMP)
   - `created_at` (TIMESTAMP)

### Step 4: Test the System
1. **Open Vision Analyser**: Navigate to [vision-analyser.html](vision-analyser.html)
2. **Complete a session**:
   - Click "Start Calibration"
   - Go through the full vision analysis
   - View results
3. **Check Supabase**: In Table Editor, check `leaderboard_reflex` table
   - Should see a new row with your ring name and reflex score
4. **View Leaderboard**: Navigate to [leaderboard.html](leaderboard.html)
   - Click the "Reflex" tab
   - You should see your entry in the leaderboard

### Step 5: Handle Combo Leaderboard (Optional)
Currently, combo points are not automatically tracked. To enable this:

**Option A**: Manual combo game implementation
- Create a combo game UI that tracks points
- Call `LeaderboardManager.updateComboScore(score, window.db)` when session ends

**Option B**: Mock data (for testing)
- Manually insert test data via Supabase dashboard:
  ```sql
  INSERT INTO leaderboard_combo (name, score, display_val)
  VALUES ('Test Fighter', 425.5, '425.5 pts');
  ```

---

## Database Schema

### leaderboard_reflex
```sql
CREATE TABLE leaderboard_reflex (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,           -- Fighter's ring name
    score FLOAT NOT NULL,                -- Avg reaction time in ms
    display_val TEXT NOT NULL,           -- Formatted: "280ms"
    last_updated TIMESTAMP,              -- Latest update
    created_at TIMESTAMP                 -- First entry
);
```

**Index**: `score ASC` (faster times first)

### leaderboard_streaks
```sql
CREATE TABLE leaderboard_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,           -- Fighter's ring name
    score INTEGER NOT NULL,              -- Days trained consecutively
    display_val TEXT NOT NULL,           -- Formatted: "15 days"
    last_updated TIMESTAMP,
    created_at TIMESTAMP
);
```

**Index**: `score DESC` (longer streaks first)

### leaderboard_combo
```sql
CREATE TABLE leaderboard_combo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    score FLOAT NOT NULL,                -- Avg points per combo level
    display_val TEXT NOT NULL,           -- Formatted: "450 pts"
    last_updated TIMESTAMP,
    created_at TIMESTAMP
);
```

**Index**: `score DESC` (highest scores first)

---

## API Integration Points

### Vision Analyser → Leaderboard
**File**: [vision-analyser.html](vision-analyser.html) (Lines ~3210)

```javascript
// After vision session completes, reflex score is synced:
if (window.LeaderboardManager && window.db) {
    const drills = analysisData.drill_data || [];
    if (drills.length > 0) {
        const avgReflex = Math.round(
            drills.reduce((a, d) => a + (d.reflex_time_ms || 0), 0) / drills.length
        );
        LeaderboardManager.updateReflexScore(avgReflex, window.db);
    }
}

// Streak is synced in saveSessionToHistory():
const streakDays = StreakManager.completeSession();
if (window.LeaderboardManager) {
    LeaderboardManager.updateStreakScore(streakDays, window.db);
}
```

---

## Troubleshooting

### "Link to Database Failed" on Leaderboard
**Cause**: Tables don't exist or Supabase connection failed
**Fix**: Run the SQL migration (Step 2 above)

### Reflex scores not appearing
**Cause**: 
- Session not saving properly
- Leaderboard manager not loaded
- Ring name not set
**Fix**:
- Check browser console for errors
- Ensure `leaderboard-manager.js` is loaded
- Verify ring name in onboarding

### Supabase RLS errors
**Cause**: Row Level Security policies blocking inserts
**Fix**: The migration includes public read/write policies. If you get errors:
1. Go to Supabase → Authentication → Policies
2. Ensure policies allow anonymous inserts/updates
3. Or disable RLS temporarily during testing

---

## Testing Checklist

- [ ] SQL migration executed successfully
- [ ] All three leaderboard tables exist in Supabase
- [ ] Complete a vision session
- [ ] Check reflex score appears in `leaderboard_reflex` table
- [ ] View leaderboard page - scores display correctly
- [ ] Refresh leaderboard - data syncs in real-time
- [ ] Multiple users can appear on leaderboard

---

## Files Modified

1. **vision-analyser.html**
   - Fixed `.score-row` formatting (CSS)
   - Added `leaderboard-manager.js` script tag
   - Added score syncing after session completion

2. **leaderboard.html**
   - No changes needed (already implemented correctly)

3. **leaderboard-manager.js** (NEW)
   - Global leaderboard management API

4. **supabase/migrations/001_create_leaderboards.sql** (NEW)
   - SQL schema for leaderboard tables

---

## Support

For issues:
1. Check browser console (F12 → Console tab)
2. Verify Supabase connection in auth.js
3. Ensure environment variables are set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Check Supabase RLS policies if getting permission errors
