/**
 * Shared onboarding guards for legacy HTML pages (planner, vision-analyser, etc.)
 */
(function (global) {
    function getOnboardingData() {
        try {
            return JSON.parse(global.localStorage.getItem('boxing_onboarding_data') || '{}');
        } catch {
            return {};
        }
    }

    function hasUserMetrics(data) {
        const m = data?.user_metrics;
        return !!(m && Number(m.age) > 0 && Number(m.weight) > 0 && Number(m.height) > 0);
    }

    function hasPlannerConfig(data) {
        const c = data?.planner_config;
        return !!(c && c.peak_window && c.preferred_time);
    }

    /** Vision session requires full fighter profile from main onboarding. */
    function hasVisionProfile(data) {
        return hasUserMetrics(data) && !!(data.experience_level || data.primary_goal);
    }

    function redirectToMainOnboarding() {
        global.location.replace('index.html');
    }

    function redirectToPlannerSetup() {
        global.location.replace('planner-config.html');
    }

    global.ZephyrOnboarding = {
        getOnboardingData,
        hasUserMetrics,
        hasPlannerConfig,
        hasVisionProfile,
        redirectToMainOnboarding,
        redirectToPlannerSetup,
    };
})(window);
