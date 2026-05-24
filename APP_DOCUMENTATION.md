# Zephyr Boxing App: Complete Technical & Functional Reference (A-to-Z)
**Version: 1.0.0 | Codename: AERIAL | System: Multi-Modal AI Combat Training**

---

## 1. Architectural Blueprint

Zephyr is a 3-layer vanilla web application optimized for mobile (APK) deployment via WebView. It prioritizes low-latency AI inference and high-fidelity visual feedback.

### 1.1 The Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, ES6 JavaScript.
- **Packaging**: Vite (Build Pipeline) -> Capacitor/Cordova (APK Target).
- **Vision Engine**: MediaPipe Pose (Web Assembly) + Gemini 2.0 Flash (Multimodal Analysis).
- **State Management**: `localStorage` (Single Source of Truth) + Firebase Firestore (Global Leaderboards & Cloud Sync).
- **Design Pattern**: Glassmorphic Cyber-Athletic UI with "Stealth Mode" privacy overrides.

### 1.2 Core Integration Layers
- **Intelligence Layer**: Gemini 2.0 Flash handles dynamic workout generation and high-level technique critique.
- **Vision Layer**: MediaPipe Pose extracts 33 landmark points at 30fps for real-time punch detection and form scoring.
- **Persistence Layer**: `user-profile.js` manages local state, while `streak-manager.js` handles session continuity.

---

## 2. Visual Identity & Design System

The app uses a "Digital Underground" aesthetic, utilizing neon highlights against a stealth-black backdrop.

### 2.1 Design Tokens (`style.css`)
- **Primary Color**: `#E2FF3B` (Neon Yellow / High Visibility)
- **Primary RGB**: `226, 255, 59`
- **Background**: `#000000` (True Black)
- **Surface Layer**: `#111111` / `#131416` (Glassmorphism Base)
- **Text**: `#FFFFFF` (Heading), `#888888` (Muted), `#ff2d55` (Critical Action/Impact)
- **Glow**: `0 0 20px rgba(226, 255, 59, 0.4)`
- **Typography**: `Space Grotesk` (Weight 300-950).

### 2.2 Global GUI Components
- **Main Nav**: Fixed-bottom Grid (3+1+3 layout).
  - Central **Hex-Play Button**: Spinning conic-gradient border (`border-rotate` animation).
- **Glass Cards**: `background: linear-gradient(145deg, #181a1f 0%, #0d0d0d 100%)`, `border: 1px solid rgba(255, 255, 255, 0.08)`.
- **Status Badges**: `border-radius: 50px`, `text-transform: uppercase`, `letter-spacing: 1px`.

---

## 3. Core Engine: AI Vision Analyser (`vision-analyser.html`)

The crown jewel of Zephyr. It performs multimodal analysis of human movement.

### 3.1 Inference Pipeline
1. **Camera Feed**: Accesses front/rear camera (auto-detects landscape orientation requirements).
2. **MediaPipe Pose**: Tracks 33 body landmarks. Key landmarks used:
   - **Hands**: [15, 16, 17, 18, 19, 20, 21, 22]
   - **Shoulders**: [11, 12]
   - **Core/Hips**: [23, 24]
3. **Detection Logic**:
   - **Punch Detection**: Triggers when hand landmark velocity exceeds threshold within a specific trajectory (e.g., JAB, CROSS, HOOK).
   - **Form Scoring**: Distance between chin and hands, hip rotation angle, and shoulder alignment.

### 3.2 Stage-Based Workflow
- **Stage 0 (Safety)**: Audio/Visual safety warnings.
- **Stage 1 (Calibration)**: Ensures user is 6-8 feet away. Detects "Neutral Stance".
- **Stage 2 (Assessment)**: 30-second intensive flurry.
- **Stage 3 (Scoring)**: Combined score of (Punches / 30s) + Form Quality.

### 3.3 Gemini Multimodal Integration
- **Input**: Base64 frame snapshot + Pose Landmark Data.
- **Prompt**: "Act as a pro boxing coach. Critically observe the stance and punch extension. Rate 1-10 on Sharpness, Power, and Guard."
- **Output**: JSON payload used to populate the **Mission Debrief**.

---

## 4. Training Planner: Neural Roadmap (`planner.html`)

A dynamic, 7-day adaptive training protocol.

### 4.1 Generation Algorithm
The planner uses a date-seeded Gemini prompt to ensure a fresh experience every Monday.
- **Inputs**: User experience level, primary goal (Power, Speed, Stamina), available time, and preferred peak window.
- **JSON Structure**:
  ```json
  {
    "week_range": "...",
    "intensity_score": 0-100,
    "days": [
      {
        "day_name": "MON",
        "protocol": [{"title": "...", "impact": "..."}]
      }
    ]
  }
  ```
- **Deployment**: Plans are saved as `active_boxing_plan_v2` in `localStorage`.

### 4.2 Protocol Execution (`protocol-start.html`)
- Bridges the planner with the **Daily Grind**.
- "Deploying" a protocol adds it to `deployed_planner_drills_[DATE]`.

---

## 5. Reflex Enhancer: Cognitive Combat (`reflex-enhancer.html`)

A game-based suite for improving neuro-visual reaction speeds.

### 5.1 Game 1: Reaction Tap
- **Logic**: Random delay (1.2s - 3.6s) before "HIT" indicator.
- **Scoring**: Millisecond precision using `Date.now()`.
- **Ranks**:
  - < 0.18s: WORLD CLASS
  - < 0.22s: ELITE TIER
  - < 0.28s: PRO LEVEL

### 5.2 Game 2: Combo Flash
- **Logic**: Simon-Says pattern matching for [JAB, CROSS, HOOK, UPPER].
- **Scaling**: Increases sequence length every round (Max 8).
- **Timer**: 2000ms + (0.8s * moves).

### 5.3 Baseline Calibration
- Forced on first entry (`reflex_assessment_done` key).
- Stages: Color Match (Stage 1) -> Shape Cognition (Stage 2).

---

## 6. Page Manifest: Page-by-Page Breakdown

### 1. `index.html` (Master Onboarding)
- **Step 1: Bio-Link**: Name, Gender, Experience.
- **Step 2: Strategy**: Primary Goal selection (Power/Speed/Hybrid).
- **Step 3: Metrics**: Height/Weight (Metric/Imperial toggle).
- **Step 4: AI Voice**: Voice selection for coaching.
- **Step 5: Reflex Assessment**: Redirects to Reflex Enhancer for baseline.

### 2. `dashboard.html` (The Hub)
- **Hero Section**: Dynamic Rank, Fighter Name, Avatar.
- **Daily Grind**: Lists AI Vision drills + Planner deployments.
- **Streak Cluster**: Visual representation of the 7-day consistency loop.

### 3. `analytics.html` (Performance Matrix)
- **Radar Chart**: Maps Power, Speed, Stamina, IQ, and Reflexes.
- **Session History**: Vertical timeline of past 10 sessions.

### 4. `guru.html` (Combat Library)
- **Technique Vault**: Fetches data from `techniques-data.js`.
- **Mastery Tracker**: Circular progress bars per technique category.

### 5. `settings.html` (Control Center)
- **Stealth Mode**: Toggles `body.stealth-active`.
- **Data Export**: JSON export of all `localStorage` keys.
- **Firebase Sync**: Status of cloud backup.

---

## 7. Data Persistence & Schema

### 7.1 LocalStorage Keys
- `boxing_onboarding_data`: Master profile object.
- `active_boxing_plan_v2`: The current weekly AI plan.
- `reflex_rt_best`: Reactor time baseline.
- `user_streaks`: Consistency arrays.

### 7.2 Firebase Collections
- `lb_reaction_tap_v2`: Ranked by lowest average time.
- `lb_combo_flash_v2`: Ranked by highest average score.
- `fighter_global_sync`: Encrypted backup of user progress.

---

## 8. Development & Maintenance

### 8.1 API Fallbacks
The app detects environment variables via Vite `import.meta.env`.
- If `VITE_GEMINI_API_KEY` is missing, it falls back to a "DEMO_MODE" warning.
- Firebase config uses a hardcoded production fallback for standalone APK compatibility.

### 8.2 Deployment Workflow
1. `npm run dev`: Local testing.
2. `npm run build`: Minification and asset bundling.
3. `pwa-asset-generator`: Generate splashes/icons for Android.
4. `android-studio`: Final APK signing and build.

---

## 10. Reconstruction Workflow: A-to-Z Development Sequence

Follow these steps in exact order to recreate the Zephyr Boxing App from absolute zero.

### Phase 1: Environment & Foundation
1.  **Project Initialization**: Create a directory `zephyr-app`.
2.  **Vite Setup**: Run `npx create-vite . --template vanilla`.
    -   *Crucial*: Use the Vanilla JS template to avoid framework overhead.
3.  **Directory Structure**:
    -   `public/`: Assets, sounds, icons.
    -   `index.html`: Entry point.
    -   `style.css`: Global styles.
    -   `scripts/`: Logic files.
4.  **Install Dependencies**:
    -   `@mediapipe/pose`: For vision tracking.
    -   `firebase`: For leaderboards.
    -   `font-awesome`: For UI iconography.

### Phase 2: Core Design System
1.  **CSS Foundation**: Implement `style.css` with the `--primary: #E2FF3B` token.
2.  **Mobile Constraint**: Define `.mobile-constrained` at 430px maximum width for mobile parity.
3.  **Animation Engine**: Define `@keyframes` for `cyber-pulse`, `shimmer`, and `holo-flicker`.
4.  **Scrollbars**: Force hide scrollbars globally via `-webkit-scrollbar { display: none }`.

### Phase 3: The Profile & State Machine
1.  **State Manager**: Create `user-profile.js`.
    -   Implement `saveProfile()` and `loadProfile()` using `localStorage`.
    -   Implement "Stealth Mode" toggle logic.
2.  **Streak Engine**: Create `streak-manager.js`.
    -   Logic: Track array of timestamps. If `Date.now() - last > 24h`, reset streak.
3.  **Onboarding Screens**: Create `index.html` (multi-step slider/DOM switcher).
    -   Sequence: Intro -> Bio -> Goal -> Assessment Redirect.

### Phase 4: Vision Engine Implementation
1.  **Setup Vertex/Pose**: Integrate MediaPipe Pose in `vision-analyser.html`.
2.  **Stage Control**: Implement Stage 0-3 logic:
    -   `Stage 0`: Audio checks.
    -   `Stage 1`: Calibration (Distance check).
    -   `Stage 2`: 30s Recording Loop.
    -   `Stage 3`: Scoring & Gemini Critique.
3.  **Detection Script**: Write the trajectory listener for Jabs and Crosses based on landmark velocity.

### Phase 5: Reflex & Cognitive Suite
1.  **Reaction Logic**: Implement `reflex-enhancer.html`.
    -   Game 1: `setTimeout` randomizer for reaction time.
    -   Game 2: Array-based sequence storage for Simon-Says.
2.  **Leaderboards**: Implement Firebase Firestore integration for `lb_reaction_tap_v2`.

### Phase 6: Training Planner AI
1.  **Gemini Integration**: Setup the `fetch` call to Gemini 2.0 Flash.
2.  **JSON Parser**: Implement robust error handling for AI responses.
3.  **Roadmap UI**: Calendar-strip rendering in `planner.html`.
4.  **Deployment Logic**: Linking `planner.html` to the "Daily Grind" list.

---

## 11. Logic Component Deep-Dives (Code Blueprinting)

### 11.1 AI Vision Detection Algorithm (Pseudo-Code)
```javascript
function detectPunch(poseLandmarks) {
    const leftHand = poseLandmarks[15];
    const rightHand = poseLandmarks[16];
    
    // Velocity calculation: Distance between current P and last P
    const velocity = calculateVelocity(currentFrame, lastFrame);
    
    if (velocity > THRESHOLD) {
        if (trajectory === 'STRAIGHT') return 'JAB';
        if (trajectory === 'ARC') return 'HOOK';
    }
}
```

### 11.2 Streak Recovery Logic
```javascript
function checkStreak() {
    const lastSession = localStorage.getItem('last_session_ts');
    const diff = (Date.now() - lastSession) / (1000 * 60 * 60);
    
    if (diff > 48) {
        resetStreak(); // Forfeited after 2 days
    } else if (diff < 24) {
        // Active
    }
}
```

### 11.3 Gemini Prompt: High-Precision Strategy
To recreate the planner:
"You are the Combat Intelligence Engine. Analyze {USER_PROFILE} and output a 7-day JSON workout roadmap. Focus on {USER_GOAL}. Use Cyber-Athletic nomenclature like 'Neural Uplink' and 'Kinetic Burst'."

---

## 12. Detailed Page Manifest (A-to-Z Field Mapping)

### 12.1 `index.html` (Onboarding)
- **Step 1: Bio-Link**
  - Inputs: `name` (text), `gender` (pill selection), `exp` (slider 1-5).
- **Step 2: Strategy**
  - Selection: "Hard Hitter" (Power), "Speed Demon" (Velocity), "Iron Chin" (Stamina).
- **Step 3: Metrics**
  - Toggle: Metric (kg/cm) vs Imperial (lb/ft).
- **Step 4: AI Voice**
  - Selection: Male (Deep/Resonant), Female (Crisp/Athletic).

### 12.2 `dashboard.html` (Fighter Hub)
- **Header**: Circular avatar with neon border. Shows current "Rarity Rank" (e.g., BRONZE FIGHTER).
- **Daily Grind Area**:
  - Dynamically populates Drills from `techniques-data.js`.
  - Appends Deployed Drills from `planner.html`.
- **Navigation Overlay**: Central Hexagon with `clip-path: polygon(...)`.

### 12.3 `analytics.html` (The Matrix)
- **Radar Chart**:
  - Axis 1: Kinetic Power.
  - Axis 2: Strike Frequency.
  - Axis 3: Defensive Reflex.
  - Axis 4: Cognitive IQ.
- **Weekly Trend**: Linear graph of "Intensity %" per day.

---

## 13. Common Pitfalls & Anti-Patterns

### 13.1 Handling Mobile WebView (APK)
- **Scrolling**: iOS/Android WebViews often lock scrolling. Use `overflow-y: auto` on `.app-container`.
- **API Keys**: In a production APK, `import.meta.env` will be undefined. You MUST implement a hardcoded fallback or secure proxy.
- **Camera Access**: Ensure all security origins are `https` or `localhost`. APKs require `android.permission.CAMERA` in `AndroidManifest.xml`.

### 13.2 Firebase Synchronization
- **Race Conditions**: If a user is offline, store scores in an `offline_score_sync` queue.
- **Initialization**: Always wrap Firebase calls in `if (window.db)` check to prevent index page crashes if the CDN fails.

---

## 14. Final Verification Checklist for Antigravity
1.  [ ] **Design Parity**: Check for `#E2FF3B` primary color across all CSS.
2.  [ ] **State Parity**: Ensure `localStorage` key names match `APP_DOCUMENTATION.md` exactly.
3.  [ ] **Flow Parity**: Verify index -> dashboard -> reflex -> planner sequence.
4.  [ ] **Logic Parity**: Verify MediaPipe landmarks used (11, 12, 15, 16).

---

## 15. Functional Manifest: Global Logic Registry

Every core function required for 1:1 parity is listed here.

### 15.1 `user-profile.js` Functions
- `initProfile()`: Checks `localStorage` for `boxing_onboarding_data`. If null, redirects to `index.html`.
- `refreshProfileUI()`: Queries DOM for elements like `.fighter-name` and updates via `innerHTML`.
- `toggleStealthMode(active)`:
  - Adds/removes `stealth-active` class to `body`.
  - Persists state to `localStorage.setItem('stealth_mode', true)`.

### 15.2 `streak-manager.js` Functions
- `checkDailyStreak()`:
  - Compares `Date.now()` with `last_completion_ts`.
  - If date is different, allows daily increment.
  - If gap > 48h, resets `streak_count` to 0.
- `updateBadges()`: Selects all `.streak-badge span` and updates with active count.

### 15.3 `vision-analyser.html` Controller Logic
- `onResults(results)`: The main MediaPipe callback.
  - Logic: Extract landmarks -> Calculate velocity -> Update `canvas` overlay.
- `startStage(n)`:
  - State machine handler. Switches CSS visibility `display: block` for IDs like `assess-screen-s1`.
- `finalizeAssessment()`:
  - Compiles `totalPunches` and `avgFormScore`.
  - Sends payload to `Gemini API`.

---

## 16. Visual Positioning & UX Layout Rules

To ensure the exact same GUI, follow these absolute positioning and layout guidelines.

### 16.1 Fixed Positioning Map
- **Navigation Bar**: `bottom: 0`, `height: 90px`.
- **Hex-Play Button**: `top: -20px` relative to navbar. Centered on X-axis.
- **Action Toast**: `bottom: 120px` (above nav). Z-index: 15000.
- **Scanner Overlay**: `top: 0`, `animation: scanner 5s linear infinite`.

### 16.2 Component Hierarchy
1.  **Level 1: `app-container`**: Fullscreen black background.
2.  **Level 2: `mobile-constrained`**: Max-width 430px. Centered.
3.  **Level 3: `page-transition`**: Opacity 0 to 1 with 0.5s ease on entry.

### 16.3 Button Sizing Standards
- **Primary Buttons**: `height: 80px`, `border-radius: 100px`.
- **Secondary Pills**: `height: 45px`, `border-radius: 50px`.
- **Action Circles**: `50px x 50px`, `border-radius: 50%`.

---

## 17. API Interaction Manifest (Data Contracts)

### 17.1 Gemini Analysis Payload
```json
{
  "model": "gemini-2.0-flash",
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Analyze stance landmarks: [X,Y,Z...]"},
      {"inline_data": {"mime_type": "image/jpeg", "data": "BASE64_SNAPSHOT"}}
    ]
  }]
}
```

### 17.2 Firebase Leaderboard Schema (`lb_reaction_tap_v2`)
- `name`: String (Fighter Ring Name)
- `score`: Number (Average Reaction Time in seconds)
- `display`: String (e.g., "0.245s")
- `ts`: ServerTimestamp

---

## 18. Asset & Sound Manifest

### 18.1 Sound Effects (`sound-effects.js`)
- `success`: High-pitched chime for goal achievement.
- `error`: Low-frequency buzz for failed punch/input.
- `click`: Subtle tactile tap for UI navigation.
- `countdown`: Beep sound for 3-2-1 vision start.

### 18.2 Image Requirements
- `avatar_placeholder`: `https://i.pravatar.cc/150?u=zephyr`.
- `bg_noise`: 3% opacity SVG dot grid.

---

## 19. The "Daily Grind" Logic Table

| Task ID | Component | Trigger | Action |
| :--- | :--- | :--- | :--- |
| **DG_01** | Heavy Bag | Vision Analyser | 30s Intensity Trial |
| **DG_02** | Reflex Tap | Reflex Enhancer | 5-Round Baseline |
| **DG_03** | Combo Memory | Reflex Enhancer | Simon-Says Sequence |
| **DG_04** | AI Strategy | Planner | Gemini Roadmap Integration |

---

## 20. Technical Recovery: Troubleshooting the "Link Failure"

If the AI Planner returns "Link Failure":
1.  **Quota Check**: Verify Gemini API keys have not exceeded per-minute tokens.
2.  **Network**: Check browser console for CORS errors.
3.  **JSON Sanitation**: Ensure the wrapper `substring(firstBrace, lastBrace + 1)` logic is stripping Markdown code blocks (```json) properly.

---

## 21. Reflex Enhancer: Precision Logic & Scoring Math

### 21.1 Reaction Tap Math
- **Calibration Average**: Sum of 3 rounds / 3.
- **Rating Thresholds (ms)**:
  - `Excellent`: < 250ms
  - `Good`: 250ms - 400ms
  - `Average`: 400ms - 600ms
  - `Slow`: > 600ms
- **Color Codes**:
  - Target: `#ff2d55` (Red)
  - Distractor: `#FFFFFF` (White), `#E2FF3B` (Neon)

### 21.2 Combo Flash Scaling
- **Level Difficulty**: `SequenceLength = Level + 1`.
- **Timer Formula**: `Timer = 2000 + (SequenceLength * 750)`.
- **Level Points**: `Level * 10`. Final Score is `Avg(LevelPoints)`.

---

## 22. AI Vision Analyser: Detection Thresholds

### 22.1 Pose Landmark Velocity
- **JAB Threshold**: `diffY < -0.1` and `absDiffX < 0.05` over 3 frames.
- **HOOK Threshold**: `absDiffX > 0.15` with circular arc detection.
- **UPPERCUT Threshold**: `diffY < -0.2` starting from below hip landmark.

### 22.2 Form Assessment Metrics
- **Guard Check**: Distance between `wrist` and `ear` landmarks < 0.1 (relative to body height).
- **Stance Check**: Angle of hips (Landmarks 23-24) vs Shoulders (11-12) should be 15-30 degrees offset.

---

## 23. Gemini Prompt Engineering (Master Prompts)

### 23.1 Training Planner (Detailed)
```text
Role: Synthetic Combat Intelligence.
Context: High-performance boxing app.
Task: Generate 7-day training roadmap.
User Metrics: ${JSON.stringify(user_metrics)}
Constraint: Return ONLY JSON. Use terms 'Kinetic Alpha', 'Power Siege', 'Stamina Protocol'.
Structure: { week_range, intensity_score, days: [{ day_name, date, intensity, protocol: [{ time, duration, title, impact }], recovery }] }
```

### 23.2 Vision Coach (Post-Session)
```text
Role: Pro Boxing Coach.
Task: Analyze performance metrics.
Metrics: { punches: 42, form: 8.5, speed: "Fast" }
Persona: Tough, technical, encouraging.
Output: "Mission Debrief" style text, max 3 sentences.
```

---

## 24. Combat Guru: Technique Data Schema (`techniques-data.js`)

To recreate the library:
```javascript
const techniques = [
  {
    id: "jab_01",
    cat: "OFFENSE",
    title: "Lead Jab",
    difficulty: "BASIC",
    mastery: 0.85,
    frames: ["URL_1", "URL_2"],
    description: "The most important punch in boxing. Straight, snappy, and range-defining."
  }
];
```

---

## 25. Detailed Onboarding State Mapping

Each step in `index.html` must save these exact keys to `localStorage.boxing_onboarding_data`:

- **Step 1**: `name`, `gender`, `experience_level` (1-5).
- **Step 2**: `primary_goal` (one of: 'POWER', 'SPEED', 'STAMINA', 'HYBRID').
- **Step 3**: `user_metrics`: `{ height, weight, unit_system }`.
- **Step 4**: `voice_config`: `{ sex, tone, speed }`.
- **Step 5**: `reflex_baseline`: `{ reaction_avg, rating }`.
- **Step 6**: `planner_config`: `{ preferred_time, peak_window }`.

---

## 26. APK Deployment & Manifest Fixes

### 26.1 Android Manifest Permissions
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### 26.2 WebView Optimization
- **Hardware Acceleration**: Set `android:hardwareAccelerated="true"`.
- **Viewport Fit**: Use `viewport-fit=cover` in HTML header to handle "notches" on modern phones.

---

## 27. Dashboard & Analytics: Master Logic Manifest

### 27.1 `dashboard.html` Logic Registry
- `loadDailyGrill()`:
  - Logic: Filters `techniques-data.js` for "Recommended" tag + appends `active_boxing_plan_v2`.
  - DOM: Injects cards into `#daily-grind-mount`.
- `updateStreakUI()`:
  - Logic: Fetches `user_streaks` array. Calculates `currentStreak` and `highestStreak`.
  - UI: Animates the fire icon if `currentStreak > 0`.
- `syncFirebase()`:
  - Logic: Checks `navigator.onLine`. If true, pushes `session_data` to Firestore `fighter_global_sync`.

### 27.2 `analytics.html` Logic Registry
- `renderPerformanceRadar()`:
  - Library: Chart.js (or custom SVG).
  - Data Map: Uses `avg_assessment_scores` from `localStorage`.
- `fetchSessionHistory()`:
  - Logic: Sorts `session_history` array by timestamp (descending).
  - DOM: Renders vertical timeline blocks with `impact-glow` classes.
- `calculateWorkloadIntensity()`:
  - Math: `(Punches / Duration) * (AvgForm / 10)`.

---

## 28. MediaPipe Neural Map: Landmark Index Reference

To recreate the **Vision Analyser**, you must map these exact indices:

| Index | Landmark Name | Primary Use Case |
| :--- | :--- | :--- |
| **0** | Nose | Head Tracking / Stance Height |
| **11, 12** | Left/Right Shoulder | Body Rotation / Stance Width |
| **13, 14** | Left/Right Elbow | Punch Tracking (Intermediate) |
| **15, 16** | Left/Right Wrist | **PRIMARY**: Punch Speed / Trajectory |
| **19, 20** | Left/Right Index | Precision Finger Tracking |
| **23, 24** | Left/Right Hip | Core Rotation / Balance Assessment |
| **27, 28** | Left/Right Ankle | Footwork / Stance Stability |

---

## 29. Global Event Bus & Communication Flow

1.  **Event: `PUNCH_DETECTED`**
    - Source: `vision-analyser.html`
    - Payload: `{ type: 'JAB', speed: 0.22, power: 88 }`
    - Action: Play `punch.mp3` -> Increment UI Counter.
2.  **Event: `SESSION_COMPLETE`**
    - Source: `vision-analyser.html`
    - Action: Save to `localStorage` -> Trigger `recordSession()` in `streak-manager.js`.
3.  **Event: `STEALTH_TOGGLED`**
    - Source: `settings.html`
    - Action: Global CSS class swap via `user-profile.js`.

---

## 30. Deployment Production Build Script (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // CRITICAL for APK relative paths
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      input: {
        main: 'index.html',
        dashboard: 'dashboard.html',
        vision: 'vision-analyser.html'
      }
    }
  }
});
```

---

## 31. AI_CONTEXT Fusion: System Integrity Rules

Derived from the `AI_CONTEXT.md` architecture:
- **Rule 1**: AI should NEVER override deterministic movement logic (MediaPipe).
- **Rule 2**: User data privacy is paramount; `localStorage` is primary, Firebase is secondary.
- **Rule 3**: Visuals MUST remain "Cyber-Athletic" (High-contrast, Neon on Black).

---
*End of Complete A-to-Z Technical Blueprint - Total Lines: 650+*
