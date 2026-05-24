// High-End Cyber Audio Engine
const AudioEngine = {
    ctx: null,
    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playClick() {
        this.init();
        const bounce = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        bounce.type = 'sine';
        bounce.frequency.setValueAtTime(800, this.ctx.currentTime);
        bounce.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        bounce.connect(gain);
        gain.connect(this.ctx.destination);
        bounce.start();
        bounce.stop(this.ctx.currentTime + 0.1);
    },
    playTransition() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(20, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    },
    playDebrief(text) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        const speakNow = () => {
            const voices = synth.getVoices();
            // Android voice names differ; prioritize Google UK or English Premium
            utterance.voice = voices.find(v => v.name.includes('Google UK') || v.lang === 'en-GB' || v.name.includes('en-gb-x-rjs')) || voices[0];
            utterance.rate = 0.85;
            utterance.pitch = 0.7;
            synth.speak(utterance);
        };

        if (synth.getVoices().length === 0) {
            synth.onvoiceschanged = () => {
                synth.onvoiceschanged = null;
                speakNow();
            };
        } else {
            speakNow();
        }
    }
};

// Global Listener for UI Clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.ripple') || e.target.closest('a')) {
        AudioEngine.playClick();
    }
});
