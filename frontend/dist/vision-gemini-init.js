/**
 * Loads Gemini config for vision-analyser (Vite env).
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';

window.ZephyrGemini = {
    apiKey,
    model,
    get url() {
        if (!apiKey) return '';
        return (
            'https://generativelanguage.googleapis.com/v1beta/models/' +
            `${model}:generateContent?key=${encodeURIComponent(apiKey)}`
        );
    },
};
