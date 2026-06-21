/**
 * Protocol session helpers ??? shared by planner, protocol-session, session-timer.
 */
(function () {
    const MAX_EXERCISES_PER_BLOCK = 2;
    const WORK_SECONDS = 45;
    const REST_SECONDS = 15;

    function progressKey(dayIdx, pIdx) {
        return `workout_progress_protocol_${dayIdx}_${pIdx}`;
    }

    function completeKey(dayIdx, pIdx) {
        return `protocol_completed_${dayIdx}_${pIdx}`;
    }

    function drillsCacheKey(dayIdx, pIdx) {
        return `protocol_drills_${dayIdx}_${pIdx}`;
    }

    function getPlan() {
        try {
            return JSON.parse(localStorage.getItem('active_boxing_plan_v2') || 'null');
        } catch (e) {
            return null;
        }
    }

    function getDrillsForProtocol(dayIdx, pIdx) {
        const plan = getPlan();
        if (!plan?.days?.[dayIdx]?.protocol?.[pIdx]) return [];

        const protocol = plan.days[dayIdx].protocol[pIdx];
        const exercises = (protocol.exercises || []).slice(0, MAX_EXERCISES_PER_BLOCK);
        if (!exercises.length) {
            exercises.push('Bodyweight Flow');
        }

        return exercises.map((name, i) => ({
            name,
            duration: WORK_SECONDS,
            type: 'timer',
            instruction: `Set ${i + 1} of ${exercises.length}: ${name}. Bodyweight only.`,
            restAfter: i < exercises.length - 1 ? REST_SECONDS : 0,
        }));
    }

    function cacheDrills(dayIdx, pIdx) {
        const drills = getDrillsForProtocol(dayIdx, pIdx);
        sessionStorage.setItem(drillsCacheKey(dayIdx, pIdx), JSON.stringify(drills));
        return drills;
    }

    function loadCachedDrills(dayIdx, pIdx) {
        try {
            const raw = sessionStorage.getItem(drillsCacheKey(dayIdx, pIdx));
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length) return parsed;
            }
        } catch (e) { /* ignore */ }
        return cacheDrills(dayIdx, pIdx);
    }

    function getCompletedIndices(dayIdx, pIdx) {
        try {
            return JSON.parse(localStorage.getItem(progressKey(dayIdx, pIdx)) || '[]');
        } catch (e) {
            return [];
        }
    }

    function getDrillCount(dayIdx, pIdx) {
        return loadCachedDrills(dayIdx, pIdx).length;
    }

    function isProtocolFullyComplete(dayIdx, pIdx) {
        const total = getDrillCount(dayIdx, pIdx);
        if (!total) return false;
        const done = getCompletedIndices(dayIdx, pIdx);
        if (done.length >= total) {
            if (localStorage.getItem(completeKey(dayIdx, pIdx)) !== '1') {
                markProtocolFullyComplete(dayIdx, pIdx);
            }
            return true;
        }
        return false;
    }

    function markDrillComplete(dayIdx, pIdx, drillIndex) {
        const key = progressKey(dayIdx, pIdx);
        const progress = getCompletedIndices(dayIdx, pIdx);
        if (!progress.includes(drillIndex)) {
            progress.push(drillIndex);
            localStorage.setItem(key, JSON.stringify(progress));
        }
        return progress;
    }

    function markProtocolFullyComplete(dayIdx, pIdx) {
        const total = getDrillCount(dayIdx, pIdx);
        const progress = getCompletedIndices(dayIdx, pIdx);
        if (progress.length < total) return false;

        localStorage.setItem(completeKey(dayIdx, pIdx), '1');

        const plan = getPlan();
        const protocol = plan?.days?.[dayIdx]?.protocol?.[pIdx];
        if (protocol) {
            const todayKey = new Date().toDateString();
            const storageKey = 'deployed_planner_drills_' + todayKey;
            const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (!existing.some((d) => d.title === protocol.title && d.fullyComplete)) {
                existing.push({
                    ...protocol,
                    deployed_at: Date.now(),
                    isPlanner: true,
                    fullyComplete: true,
                });
                localStorage.setItem(storageKey, JSON.stringify(existing));
            }
        }
        return true;
    }

    function resetProtocolProgress(dayIdx, pIdx) {
        localStorage.removeItem(progressKey(dayIdx, pIdx));
        localStorage.removeItem(completeKey(dayIdx, pIdx));
        sessionStorage.removeItem(drillsCacheKey(dayIdx, pIdx));
    }

    window.ProtocolSession = {
        MAX_EXERCISES_PER_BLOCK,
        WORK_SECONDS,
        REST_SECONDS,
        getDrillsForProtocol,
        cacheDrills,
        loadCachedDrills,
        getCompletedIndices,
        getDrillCount,
        isProtocolFullyComplete,
        markDrillComplete,
        markProtocolFullyComplete,
        resetProtocolProgress,
        progressKey,
        completeKey,
    };
})();
