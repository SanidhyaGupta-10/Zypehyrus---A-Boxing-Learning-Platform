import './streak-manager.js';
import './notification-manager.js';
import './sound-effects.js';
import './user-profile.js';

const StreakManager = window.StreakManager;
const AppSounds = window.AppSounds;
const Z = window.ZephyrOnboarding;

const env = (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const API_KEY = env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_KEY || window.VITE_GEMINI_API_KEY || window.NEXT_PUBLIC_GEMINI_API_KEY || window.GEMINI_API_KEY || '';
const mount = document.getElementById('planner-mount');
const onboardingPrompt = document.getElementById('onboarding-prompt');
const onboardingPlannerSetup = document.getElementById('onboarding-planner-setup');

function normalizePlan(plan, userData) {
    const normalized = window.PlannerPlanBuilder.normalizePlan(plan, userData);
    if (!normalized) {
        throw new Error('Gemini returned an incomplete plan. Please retry.');
    }
    normalized.generated_by = 'gemini';
    return normalized;
}

function showPlannerLoading(message) {
    if (!mount) return;
    mount.style.display = 'block';
    mount.innerHTML = `
        <div class="loading-view">
            <div class="spinner"></div>
            <h2 style="font-weight:950;text-transform:uppercase;color:#fff;margin-bottom:10px;">GEMINI AI</h2>
            <p style="color:var(--zinc-500);font-size:0.8rem;max-width:280px;line-height:1.5;">${message || 'Generating your 7-day bodyweight roadmap…'}</p>
        </div>`;
}

async function fetchPlanFromGemini(userData) {
    const backendBase =
        env.VITE_BACKEND_URL ||
        env.VITE_API_URL ||
        window.VITE_BACKEND_URL ||
        window.VITE_API_URL ||
        window.NEXT_PUBLIC_API_URL ||
        window.ZEPHYR_API_BASE ||
        'http://localhost:3000';
    const backendUrl = backendBase.replace(/\/$/, '') + '/api/generate-plan';

    try {
        console.log('[Planner] Requesting plan from Gemini via backend:', backendUrl);
        
        // Create an abort controller with 30-second timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userData }),
            signal: controller.signal
        });
        
        clearTimeout(timeout);

        if (response.status === 429) {
            throw new Error('Neural Capacity Reached. Please wait a moment for the uplink to stabilize.');
        }

        if (response.ok) {
            const resJson = await response.json();
            if (resJson.plan) {
                console.log('[Planner] Plan received from backend Gemini proxy');
                return normalizePlan(resJson.plan, userData);
            } else {
                throw new Error('Backend returned empty plan');
            }
        } else if (response.status !== 503) {
            const errorText = await response.text();
            console.warn('[Planner] Backend error:', response.status, errorText);
            throw new Error(`Backend error: ${response.status}`);
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            console.warn('[Planner] Backend request timeout (30s)');
        } else {
            console.warn('[Planner] Backend Gemini proxy failed:', err.message);
        }
    }

    // Fallback: Try direct Gemini API
    if (API_KEY && window.PlannerGemini) {
        console.log('[Planner] Calling Gemini API directly from client');
        try {
            const raw = await window.PlannerGemini.generatePlanViaGemini(API_KEY, userData);
            return normalizePlan(raw, userData);
        } catch (e) {
            console.warn('[Planner] Direct Gemini API failed:', e.message);
            throw e;
        }
    }

    throw new Error(
        'Gemini AI is required to build your planner. Run the backend (npm start) with GEMINI_API_KEY in .env, or set VITE_GEMINI_API_KEY for direct access.'
    );
}

function plannerConfigFingerprint(data) {
    const c = data?.planner_config || {};
    return `${c.preferred_time || ''}|${c.peak_window || ''}`;
}

function savePlannerConfigFingerprint(data) {
    localStorage.setItem('planner_config_fingerprint_v2', plannerConfigFingerprint(data));
}

async function init() {
    if (!mount || !Z) {
        console.error('[Planner] Missing mount or ZephyrOnboarding helpers');
        return;
    }

    const data = Z.getOnboardingData();

    try {
        StreakManager?.updateBadges?.();
    } catch (e) {
        console.warn('[Planner] StreakManager:', e);
    }

    if (!Z.hasUserMetrics(data)) {
        mount.style.display = 'none';
        if (onboardingPlannerSetup) onboardingPlannerSetup.style.display = 'none';
        if (onboardingPrompt) onboardingPrompt.style.display = 'flex';
        return;
    }

    if (!Z.hasPlannerConfig(data)) {
        mount.style.display = 'none';
        if (onboardingPrompt) onboardingPrompt.style.display = 'none';
        if (onboardingPlannerSetup) onboardingPlannerSetup.style.display = 'flex';
        return;
    }

    if (onboardingPrompt) onboardingPrompt.style.display = 'none';
    if (onboardingPlannerSetup) onboardingPlannerSetup.style.display = 'none';
    mount.style.display = 'block';

    const storedPlan = localStorage.getItem('active_boxing_plan_v2');
    const lastGen = localStorage.getItem('last_plan_gen_date_v2');
    const today = new Date().toDateString();
    const configFp = plannerConfigFingerprint(data);
    const savedFp = localStorage.getItem('planner_config_fingerprint_v2');
    const configChanged = savedFp !== null && savedFp !== configFp;

    if (storedPlan && lastGen === today && !configChanged) {
        try {
            const cached = normalizePlan(JSON.parse(storedPlan), data);
            localStorage.setItem('active_boxing_plan_v2', JSON.stringify(cached));
            savePlannerConfigFingerprint(data);
            renderPlan(cached);
            return;
        } catch (e) {
            console.warn('[Planner] Cached plan invalid, regenerating via Gemini:', e.message);
        }
    }

    if (storedPlan && configChanged) {
        await generatePlan(data, today);
        return;
    }

    await generatePlan(data, today);
}

async function generatePlan(userData, todayDateStr) {
    showPlannerLoading('Gemini is building your weekly protocol from your profile and session time…');

    try {
        const plan = await fetchPlanFromGemini(userData);

        if (!plan) {
            throw new Error('No plan was generated. Please try again.');
        }

        localStorage.setItem('active_boxing_plan_v2', JSON.stringify(plan));
        localStorage.setItem('last_plan_gen_date_v2', todayDateStr);
        savePlannerConfigFingerprint(userData);
        if (!localStorage.getItem('last_plan_gen_timestamp')) {
            localStorage.setItem('last_plan_gen_timestamp', Date.now());
        }

        AppSounds?.play?.('success');
        renderPlan(plan);
    } catch (error) {
        console.error('[Planner] Gemini generation failed:', error);
        AppSounds?.play?.('error');
        
        const errorMessage = error?.message || 'Unknown error occurred';
        mount.innerHTML = `
            <div style="padding: 80px 32px; text-align: center; color: #ff4444;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h2 style="font-weight: 900; text-transform: uppercase;">GEMINI OFFLINE</h2>
                <p style="font-size: 0.8rem; color: var(--zinc-500); margin-top: 10px; line-height: 1.5;">${errorMessage}</p>
                <p style="font-size: 0.65rem; color: #666; margin-top: 16px;">Troubleshooting: Make sure the backend is running with <code style="background:#222;padding:2px 6px;border-radius:3px;">GEMINI_API_KEY</code> set in <code style="background:#222;padding:2px 6px;border-radius:3px;">.env</code>, or set <code style="background:#222;padding:2px 6px;border-radius:3px;">VITE_GEMINI_API_KEY</code> for direct client access.</p>
                <button onclick="location.reload()" class="btn-primary hover-scale ripple" style="margin-top: 24px; height: 50px; padding: 0 20px; font-size: 0.8rem; background: var(--neon); color: #000; border: none; font-weight: 950; border-radius: 25px; cursor: pointer;">RETRY GEMINI</button>
            </div>
        `;
    }
}

let activeIdx = 0;
window.switchDay = (idx) => {
    activeIdx = idx;
    const plan = JSON.parse(localStorage.getItem('active_boxing_plan_v2'));
    renderPlan(plan);
};

function renderPlanWithIndex(plan) {
    const dayData = plan.days[activeIdx];
    const PS = window.ProtocolSession;

    mount.innerHTML = `
                <div class="animate-fade anim-slide-right">
                    <header class="roadmap-header">
                        <div class="header-left">
                            <i class="fa-solid fa-bolt bolt-icon"></i>
                            <div class="header-title">STRATEGY DEPLOYED</div>
                        ${plan.generated_by === 'gemini' ? '<div style="font-size:0.45rem;color:var(--primary);font-weight:900;letter-spacing:2px;margin-top:4px;">POWERED BY GEMINI AI</div>' : ''}
                        </div>
                        <div class="notification-bell">
                            <i class="fa-solid fa-bell"></i>
                        </div>
                    </header>
                </div>

                <div class="roadmap-summary animate-slide-up hover-scale" style="animation-delay: 0.1s; animation-fill-mode: both;">
                    <div class="performance-track">PERFORMANCE TRACK</div>
                    <div class="weekly-title-row">
                        <h1 class="weekly-title">WEEKLY ROADMAP</h1>
                        <span class="date-range">${plan.week_range}</span>
                    </div>
                    ${plan.planner_schedule ? `
                    <div style="font-size:0.6rem;color:var(--zinc-500);font-weight:800;letter-spacing:1px;margin-top:8px;text-transform:uppercase;">
                        <i class="fa-regular fa-clock" style="color:var(--primary);margin-right:6px;"></i>
                        Sessions from ${plan.planner_schedule.preferred_time_display}
                        · ${plan.planner_schedule.peak_window} PEAK
                    </div>` : ''}

                    <div class="calendar-strip">
                        ${plan.days
                            .map(
                                (day, i) => `
                            <div class="cal-item ${i === activeIdx ? 'active animate-pulse' : 'hover-scale ripple'}" onclick="window.switchDay(${i})" style="transition: all 0.3s;" title="${day.day_type || ''}">
                                <span class="cal-day-name">${day.day_name}</span>
                                <span class="cal-date">${day.date}</span>
                                <span class="cal-day-type">${day.day_type || ''}</span>
                            </div>
                        `
                            )
                            .join('')}
                    </div>
                </div>

                <div class="section-label animate-fade anim-slide-right" style="animation-delay: 0.2s; animation-fill-mode: both;">
                    ${dayData.day_type || "TODAY'S PROTOCOL"}
                </div>
                
                <div class="protocol-list stagger-anim" style="animation-delay: 0.3s;">
                    ${dayData.protocol
                        .map((p, i) => {
                            const isComplete = PS?.isProtocolFullyComplete?.(String(activeIdx), String(i)) || false;
                            const inProgress = !isComplete && (PS?.getCompletedIndices?.(String(activeIdx), String(i))?.length || 0) > 0;
                            const exerciseList = (p.exercises || []).slice(0, 2).join(' • ');
                            const statusLabel = isComplete
                                ? '<i class="fa-solid fa-check-double"></i> COMPLETE'
                                : inProgress
                                  ? 'IN PROGRESS'
                                  : 'BODYWEIGHT • 2 MOVES';
                            return `
                        <div class="protocol-card hover-scale ripple ${i === 0 && !isComplete ? 'active' : ''} ${isComplete ? 'deployed' : ''}" 
                             onclick="window.location.href='protocol-session.html?day=${activeIdx}&p=${i}'" style="animation-fill-mode: both;">
                            <div class="card-left">
                                <div class="card-meta">${p.time} • ${p.duration}</div>
                                <div class="card-day-tag">${p.day_type || dayData.day_type || p.impact || ''}</div>
                                <div class="card-title">${p.title}</div>
                                ${exerciseList ? `<div class="card-exercises">${exerciseList}</div>` : ''}
                                <div class="card-badge" style="${isComplete ? 'background: var(--neon); color: #000; border: none;' : ''}">
                                    ${statusLabel}
                                </div>
                            </div>
                            <div class="play-btn ${i === 0 && !isComplete ? 'active' : ''}" style="${isComplete ? 'background: rgba(226, 255, 59, 0.1); color: var(--neon);' : ''}">
                                <i class="fa-solid ${isComplete ? 'fa-check' : 'fa-play'}"></i>
                            </div>
                        </div>
                        `;
                        })
                        .join('')}
                </div>

                <div class="recovery-pillar animate-slide-up hover-scale" style="animation-delay: 0.4s; animation-fill-mode: both;">
                    <div class="recovery-content">
                        <div class="recovery-label">RECOVERY PILLAR</div>
                        <div class="recovery-text">${dayData.recovery}</div>
                    </div>
                    <i class="fa-solid fa-moon recovery-icon"></i>
                </div>

                <div class="intensity-section animate-slide-up hover-scale" style="animation-delay: 0.5s; animation-fill-mode: both;">
                    <div class="intensity-header">
                        <div class="intensity-label">WEEKLY INTENSITY</div>
                        <div class="intensity-val">${plan.intensity_score}%</div>
                    </div>
                    <div class="chart-container">
                        ${plan.days
                            .map(
                                (day, i) => `
                            <div class="bar ${i === activeIdx ? 'active' : ''}" style="height: ${day.intensity}%; transition: height 1s cubic-bezier(0.4, 0, 0.2, 1) ${0.5 + i * 0.1}s;"></div>
                        `
                            )
                            .join('')}
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px; position: absolute; bottom: 20px; right: 20px;">
                        <button type="button" class="reset-btn hover-scale" onclick="window.regenerateRoadmap()" id="regen-btn" style="position: static; width: auto; height: auto; padding: 12px 24px; border-radius: 12px; font-size: 0.75rem;">
                            <i class="fa-solid fa-sync"></i>
                            <span>REGENERATE</span>
                        </button>
                        <div id="regen-timer" style="font-size: 0.55rem; font-weight: 900; color: var(--primary); letter-spacing: 1.5px; text-transform: uppercase;"></div>
                    </div>
                </div>
            `;
}

function renderPlan(plan) {
    renderPlanWithIndex(plan);
}

window.regenerateRoadmap = async function () {
    const lastGen = localStorage.getItem('last_plan_gen_timestamp');
    const now = Date.now();
    const cooldown = 3 * 24 * 60 * 60 * 1000;

    if (lastGen && now - lastGen < cooldown) {
        const remaining = cooldown - (now - lastGen);
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        alert(`Neural Link Cooldown: ${days}d ${hours}h remaining before next Gemini generation.`);
        return;
    }

    if (!confirm('Regenerate roadmap with Gemini AI? Current week plan will be replaced.')) {
        return;
    }

    const data = Z.getOnboardingData();
    localStorage.removeItem('active_boxing_plan_v2');
    localStorage.removeItem('last_plan_gen_date_v2');
    localStorage.setItem('last_plan_gen_timestamp', Date.now());
    await generatePlan(data, new Date().toDateString());
};

window.resetEngine = function () {
    if (confirm('DANGER: This will wipe your bio-metrics and roadmap. Re-start onboarding?')) {
        localStorage.clear();
        window.location.assign('index.html');
    }
};

function updateRegenButton() {
    const btn = document.getElementById('regen-btn');
    const timer = document.getElementById('regen-timer');
    if (!btn || !timer) return;

    const lastGen = localStorage.getItem('last_plan_gen_timestamp');
    const now = Date.now();
    const cooldown = 3 * 24 * 60 * 60 * 1000;

    if (lastGen && now - lastGen < cooldown) {
        const remaining = cooldown - (now - lastGen);
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        btn.style.opacity = '0.5';
        timer.innerText = `NEXT SYNC: ${days}D ${hours}H`;
    } else {
        timer.innerText = 'LINK READY';
        timer.style.opacity = '0.3';
    }
}

setTimeout(updateRegenButton, 100);

init().catch((err) => {
    console.error('[Planner] init failed:', err);
    if (mount) {
        mount.innerHTML = `
            <div style="padding: 80px 24px; text-align: center; color: #ff6b6b;">
                <h2 style="font-weight: 900; text-transform: uppercase;">Planner Offline</h2>
                <p style="margin-top: 12px; color: var(--zinc-500); font-size: 0.85rem;">${err.message}</p>
                <button onclick="location.reload()" class="btn-primary" style="margin-top: 24px;">RETRY</button>
            </div>`;
    }
});
