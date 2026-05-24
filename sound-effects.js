/**
 * ANTIGRAVITY BOXING - Global Sound Effects Manager
 */

const AppSounds = {
    // Sound Library
    slash: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fast-rocket-whoosh-1714.mp3'),
    click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-31.mp3'),
    success: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3'),
    punch: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-boxer-punch-impact-2122.mp3'),
    error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),

    init() {
        // Preload sounds
        Object.values(this).forEach(sound => {
            if (sound instanceof Audio) {
                sound.load();
                sound.volume = 0.5;
            }
        });

        // Auto-bind clicks to buttons if requested
        this.bindGlobalClicks();
    },

    play(effect) {
        if (this[effect]) {
            this[effect].currentTime = 0;
            this[effect].play().catch(e => console.warn("Audio play blocked by browser:", e));
        }
    },

    bindGlobalClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .ctrl-btn, .nav-item, .clickable');
            if (target) {
                this.play('click');
            }
        });
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => AppSounds.init());
