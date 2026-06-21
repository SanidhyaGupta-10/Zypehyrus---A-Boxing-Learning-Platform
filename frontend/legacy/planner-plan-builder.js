/**
 * Deterministic weekly roadmap: 7 day types, 6 bodyweight protocol blocks per day.
 */
(function () {
    const DAY_TYPES = [
        { key: 'push', label: 'PUSH DAY' },
        { key: 'pull', label: 'PULL DAY' },
        { key: 'leg', label: 'LEG DAY' },
        { key: 'endurance', label: 'ENDURANCE DAY' },
        { key: 'strength', label: 'STRENGTH DAY' },
        { key: 'push', label: 'PUSH DAY' },
        { key: 'recovery', label: 'ACTIVE RECOVERY' },
    ];

    const EXERCISES = {
        push: [
            'Standard Push-Ups',
            'Wide Push-Ups',
            'Diamond Push-Ups',
            'Pike Push-Ups',
            'Chair Dips',
            'Shoulder Tap Plank',
            'Decline Push-Ups (feet elevated)',
            'Explosive Push-Ups',
        ],
        pull: [
            'Inverted Rows (table)',
            'Doorframe Rows',
            'Superman Hold',
            'Reverse Snow Angels',
            'Prone Y-Raises',
            'Isometric Chin Hold',
            'Bandless Face Pulls',
            'Wall Walkouts',
        ],
        leg: [
            'Bodyweight Squats',
            'Walking Lunges',
            'Bulgarian Split Squats',
            'Glute Bridges',
            'Calf Raises',
            'Jump Squats',
            'Wall Sit',
            'Single-Leg RDL (bodyweight)',
        ],
        endurance: [
            'Burpees',
            'Mountain Climbers',
            'High Knees',
            'Jumping Jacks',
            'Shadow Boxing Rounds',
            'Skater Hops',
            'Fast Feet Drill',
            'Sprawl to Stand',
        ],
        strength: [
            'Plyometric Push-Ups',
            'Tempo Squats (3-1-1)',
            'Single-Leg Squats',
            'Plank to Push-Up',
            'Bear Crawl',
            'Crab Walk',
            'Hollow Body Hold',
            'Side Plank Reach-Through',
        ],
        recovery: [
            'Cat-Cow Flow',
            'World\'s Greatest Stretch',
            'Hip Circles',
            'Arm Swings',
            'Deep Squat Hold',
            'Child\'s Pose',
            'Leg Swings',
            'Thoracic Rotations',
        ],
    };

    const PROTOCOL_BLOCKS = [
        { title: 'WARM-UP', duration: '5 MIN', offsetMin: 0 },
        { title: 'PRIMARY BLOCK', duration: '12 MIN', offsetMin: 8 },
        { title: 'SECONDARY BLOCK', duration: '10 MIN', offsetMin: 22 },
        { title: 'CONDITIONING', duration: '8 MIN', offsetMin: 34 },
        { title: 'COOLDOWN', duration: '5 MIN', offsetMin: 44 },
    ];

    const EXERCISES_PER_BLOCK = 2;

    const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    function padTime(h, m) {
        const ap = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
    }

    /** HTML <input type="time"> returns "HH:mm" (24h). Also accepts "7:30 AM". */
    function parsePreferredTime(timeStr) {
        const raw = String(timeStr || '07:30').trim();
        const match = raw.match(/(\d{1,2}):(\d{2})/);
        let h = match ? parseInt(match[1], 10) : 7;
        let m = match ? parseInt(match[2], 10) : 30;
        if (/pm/i.test(raw) && h < 12) h += 12;
        if (/am/i.test(raw) && h === 12) h = 0;
        if (!/am|pm/i.test(raw) && h >= 0 && h <= 23) {
            /* keep 24h value from onboarding time picker */
        }
        return { h: h % 24, m: m % 60 };
    }

    function addMinutes(timeStr, minutes) {
        const { h, m } = parsePreferredTime(timeStr);
        let total = h * 60 + m + minutes;
        while (total < 0) total += 24 * 60;
        total = total % (24 * 60);
        return padTime(Math.floor(total / 60), total % 60);
    }

    function getPreferredTime(userData) {
        return userData?.planner_config?.preferred_time || '07:30';
    }

    /** Re-stamp every protocol block with times from onboarding preferred_time. */
    function applyUserSchedule(plan, userData) {
        if (!plan?.days?.length) return plan;
        const preferred = getPreferredTime(userData);

        plan.days.forEach((day, i) => {
            const dt = DAY_TYPES[i] || DAY_TYPES[0];
            const dayLabel = day.day_type || dt.label;
            const schedule = buildProtocolsForDay(dt.key, dayLabel, preferred);
            const protocols = Array.isArray(day.protocol) ? day.protocol : [];

            day.protocol = protocols.map((p, j) => ({
                ...p,
                time: schedule[j]?.time || addMinutes(preferred, PROTOCOL_BLOCKS[j]?.offsetMin || 0),
            }));

            plan.planner_schedule = {
                preferred_time: preferred,
                preferred_time_display: addMinutes(preferred, 0),
                peak_window: userData?.planner_config?.peak_window || 'MORNING',
            };
        });

        return plan;
    }

    function pickExercises(dayKey, blockIndex, count) {
        const pool = EXERCISES[dayKey] || EXERCISES.push;
        const out = [];
        for (let i = 0; i < count; i++) {
            out.push(pool[(blockIndex * 3 + i) % pool.length]);
        }
        return out;
    }

    function buildProtocolsForDay(dayKey, dayLabel, preferredTime) {
        return PROTOCOL_BLOCKS.map((block, i) => ({
            time: addMinutes(preferredTime, block.offsetMin),
            duration: block.duration,
            title: `${dayLabel}: ${block.title}`,
            impact: dayLabel,
            day_type: dayLabel,
            exercises: pickExercises(dayKey, i, EXERCISES_PER_BLOCK),
        }));
    }

    function recoveryForDay(dayKey) {
        const map = {
            push: 'Chest & triceps foam roll • 10 min walk',
            pull: 'Lat stretch • bandless shoulder mobility',
            leg: 'Quad & hip flexor stretch • easy walk',
            endurance: 'Box breathing • light walk cooldown',
            strength: 'Full-body stretch • parasympathetic reset',
            recovery: 'Breathwork • yoga flow • sleep hygiene',
        };
        return map[dayKey] || 'Active mobility & hydration';
    }

    function buildWeeklyPlan(userData) {
        const start = new Date();
        const preferred = getPreferredTime(userData);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const week_range = `${start.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${start.getDate()} - ${end.getDate()}`;

        const days = DAY_TYPES.map((dt, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const intensity =
                dt.key === 'recovery' ? 35 : 55 + (i % 4) * 8 + (dt.key === 'strength' ? 10 : 0);

            return {
                day_name: DAY_NAMES[i],
                date: String(d.getDate()),
                day_type: dt.label,
                intensity: Math.min(intensity, 98),
                protocol: buildProtocolsForDay(dt.key, dt.label, preferred),
                recovery: recoveryForDay(dt.key),
            };
        });

        const intensity_score = Math.round(
            days.reduce((s, d) => s + d.intensity, 0) / days.length
        );

        const plan = {
            week_range,
            intensity_score,
            days,
            planner_schedule: {
                preferred_time: preferred,
                preferred_time_display: addMinutes(preferred, 0),
                peak_window: userData?.planner_config?.peak_window || 'MORNING',
            },
        };
        return plan;
    }

    /**
     * Validate & lightly repair Gemini plans (times from onboarding, cap exercises).
     * Returns null if the AI payload is too incomplete to use.
     */
    function normalizePlan(plan, userData) {
        const local = buildWeeklyPlan(userData);
        if (!plan || !Array.isArray(plan.days) || plan.days.length < 7) {
            return null;
        }

        const normalized = {
            week_range: plan.week_range || local.week_range,
            intensity_score: plan.intensity_score || local.intensity_score,
            days: plan.days.slice(0, 7).map((day, i) => {
                const fallback = local.days[i];
                const dayType =
                    day.day_type ||
                    fallback.day_type ||
                    DAY_TYPES[i].label;
                const dayKey = DAY_TYPES[i].key;

                let protocols = Array.isArray(day.protocol) ? day.protocol : [];
                if (protocols.length < 5) {
                    protocols = fallback.protocol.map((fb, j) => ({
                        ...fb,
                        ...(protocols[j] || {}),
                        time: fb.time,
                        exercises: ((protocols[j] && protocols[j].exercises) || fb.exercises || [])
                            .slice(0, EXERCISES_PER_BLOCK),
                    }));
                    while (protocols.length < 5) {
                        protocols.push(fallback.protocol[protocols.length]);
                    }
                } else {
                    protocols = protocols.slice(0, 5).map((p, j) => {
                        const fb = fallback.protocol[j] || fallback.protocol[0];
                        const exercises = (
                            Array.isArray(p.exercises) && p.exercises.length
                                ? p.exercises
                                : fb.exercises
                        )
                            .filter(Boolean)
                            .slice(0, EXERCISES_PER_BLOCK);
                        return {
                            ...fb,
                            ...p,
                            time: fb.time,
                            day_type: dayType,
                            impact: dayType,
                            title: p.title || fb.title,
                            exercises,
                        };
                    });
                }
                protocols = protocols.map((p) => ({
                    ...p,
                    exercises: (p.exercises || []).slice(0, EXERCISES_PER_BLOCK),
                }));

                return {
                    ...fallback,
                    ...day,
                    day_name: day.day_name || fallback.day_name,
                    date: String(day.date || fallback.date),
                    day_type: dayType,
                    intensity: day.intensity ?? fallback.intensity,
                    protocol: protocols,
                    recovery: day.recovery || fallback.recovery,
                };
            }),
        };

        while (normalized.days.length < 7) {
            normalized.days.push(local.days[normalized.days.length]);
        }

        const scheduled = applyUserSchedule(normalized, userData);
        scheduled.generated_by = plan.generated_by || 'gemini';
        return scheduled;
    }

    window.PlannerPlanBuilder = {
        buildWeeklyPlan,
        normalizePlan,
        applyUserSchedule,
        getPreferredTime,
        addMinutes,
        DAY_TYPES,
    };
})();
