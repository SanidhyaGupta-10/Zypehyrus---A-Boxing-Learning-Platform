export const StreakManager = {
    STORAGE_KEY: 'boxing_streak_data',

    getStreakData() {
        const defaultData = { currentStreak: 0, lastCompletedDate: null };
        const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || JSON.stringify(defaultData));
        return data;
    },

    saveStreakData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    completeSession() {
        const data = this.getStreakData();
        const today = new Date().toDateString(); // e.g., "Sun Mar 01 2026"

        if (data.lastCompletedDate === today) {
            console.log("Session already completed today. Streak maintained but not incremented.");
            return data.currentStreak;
        }

        const lastDate = data.lastCompletedDate ? new Date(data.lastCompletedDate) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (data.lastCompletedDate === yesterdayStr) {
            // Yesterday was completed, increment streak
            data.currentStreak += 1;
        } else {
            // Streak broken (more than a day) or first time
            data.currentStreak = 1;
        }

        data.lastCompletedDate = today;
        this.saveStreakData(data);
        this.updateBadges();
        return data.currentStreak;
    },

    // Check if streak should be reset visually (last completion was > 1 day ago)
    checkAndGetStreak() {
        const data = this.getStreakData();
        if (!data.lastCompletedDate) return 0;

        const today = new Date();
        const lastDate = new Date(data.lastCompletedDate);

        // Calculate difference with full days (midnight to midnight)
        const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastDateZero = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

        const diffTime = Math.abs(todayZero - lastDateZero);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // If more than 1 day has passed without a session, the streak is technically at 0
        // until they complete one today.
        if (diffDays > 1) {
            return 0;
        }

        return data.currentStreak;
    },

    async syncWithSupabase(client) {
        if (!client) return;

        try {
            const onboardingData = JSON.parse(localStorage.getItem('boxing_onboarding_data') || '{}');
            const name = (onboardingData.ring_name || 'FIGHTER').toUpperCase();
            const streak = this.checkAndGetStreak();

            if (streak <= 0) return;

            // Simplified upsert logic for Supabase
            const { error } = await client
                .from('leaderboard_streaks')
                .upsert({
                    name: name,
                    score: streak,
                    display_val: streak.toString(),
                    last_updated: new Date().toISOString()
                }, {
                    onConflict: 'name'
                });

            if (error) throw error;
            console.log("Streak synced with Supabase:", streak);
        } catch (e) {
            console.error("Supabase Streak Sync Error:", e);
        }
    },

    getRank(score) {
        if (score >= 31) return { name: 'MASTER', color: '#E2FF3B', class: 'rank-master', icon: 'fa-fire' };
        if (score >= 22) return { name: 'DIAMOND', color: '#B9F2FF', class: 'rank-diamond', icon: 'fa-gem' };
        if (score >= 15) return { name: 'PLATINUM', color: '#E5E4E2', class: 'rank-platinum', icon: 'fa-award' };
        if (score >= 8) return { name: 'GOLD', color: '#FFD700', class: 'rank-gold', icon: 'fa-medal' };
        if (score >= 4) return { name: 'SILVER', color: '#C0C0C0', class: 'rank-silver', icon: 'fa-shield-halved' };
        if (score >= 1) return { name: 'BRONZE', color: '#CD7F32', class: 'rank-bronze', icon: 'fa-shield' };
        return { name: 'ROOKIE', color: '#444', class: 'rank-rookie', icon: 'fa-user' };
    },

    updateBadges() {
        const streak = this.checkAndGetStreak();
        const badges = document.querySelectorAll('.streak-badge span');
        badges.forEach(el => {
            if (el.parentElement.closest('.nav-hex-wrap') || el.parentElement.closest('.camera-main')) {
                el.innerText = streak;
            } else {
                el.innerText = streak + "D STREAK";
            }
        });
    }
};

// Auto-run on every page load
document.addEventListener('DOMContentLoaded', () => {
    StreakManager.updateBadges();
});

window.StreakManager = StreakManager;
