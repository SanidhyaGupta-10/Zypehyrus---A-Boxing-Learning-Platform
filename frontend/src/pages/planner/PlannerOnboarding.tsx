import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Zap, Trophy, Crown, BarChart3, Wind, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlannerFormData {
    experience: string;
    focus: string;
    equipment: string[];
    duration: number;
    frequency: string;
}

const PlannerOnboarding: React.FC = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<PlannerFormData>({
        experience: '',
        focus: '',
        equipment: [],
        duration: 0,
        frequency: '',
    });

    const loadingPhrases = [
        'Synthesizing Protocol...',
        'Establishing Neural Uplink...',
        'Calibrating Combat Vectors...',
        'Engaging AI Headmaster...',
        'Generating Elite Strategy...',
    ];

    const [loadingPhrase, setLoadingPhrase] = useState(loadingPhrases[0]);

    // Cycle loading phrases
    React.useEffect(() => {
        if (!loading) return;
        let phraseIndex = 0;
        const interval = setInterval(() => {
            phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
            setLoadingPhrase(loadingPhrases[phraseIndex]);
        }, 2000);
        return () => clearInterval(interval);
    }, [loading]);

    const handleNext = async () => {
        if (step === 5) {
            await submitPlan();
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const submitPlan = async () => {
        setLoading(true);
        setError('');

        try {
            const onboardingData = JSON.parse(localStorage.getItem('boxing_onboarding_data') || '{}');
            
            const payload = {
                experience: formData.experience,
                focus: formData.focus,
                equipment: formData.equipment,
                duration: formData.duration,
                frequency: formData.frequency,
                user_metrics: onboardingData.user_metrics || {},
            };

            const apiUrl = import.meta.env.VITE_API_URL || 'https://boxing-backend-rrbvfjabvq-uc.a.run.app';
            const response = await fetch(`${apiUrl}/api/generate-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const result = await response.json();

            // Store the generated plan
            localStorage.setItem('active_boxing_plan_v2', JSON.stringify(result.plan));
            localStorage.setItem('last_plan_gen_date_v2', new Date().toDateString());
            localStorage.removeItem('auto_generate_plan');

            // Redirect to planner view
            window.location.href = '/planner';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate plan');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wider">
                        {loadingPhrase}
                    </h2>
                    <p className="text-white/50 text-sm">Your elite training roadmap is being crafted by AI</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-sm font-black text-primary uppercase tracking-[3px]">
                            ELITE PLANNER SETUP
                        </h1>
                        <span className="text-xs font-bold text-white/40 uppercase">
                            {step}/5
                        </span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-primary/50"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(step / 5) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Step 1: Experience Level */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
                                    WHAT'S YOUR <br />
                                    <span className="text-primary italic">COMBAT LEVEL</span>
                                </h2>
                                <p className="text-white/60 text-sm mt-4 leading-relaxed">
                                    Let's match your training to your experience.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'novice', label: 'NOVICE', desc: 'Just starting your fight journey', icon: <Zap size={20} /> },
                                    { id: 'intermediate', label: 'INTERMEDIATE', desc: 'You know the fundamentals', icon: <Trophy size={20} /> },
                                    { id: 'advanced', label: 'ADVANCED CONTENDER', desc: 'Serious fighter - advanced techniques', icon: <Crown size={20} /> },
                                ].map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, experience: opt.id })}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                                            formData.experience === opt.id
                                                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]'
                                                : 'border-white/10 hover:border-white/20 bg-white/5'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <h3 className={`text-xl font-black uppercase tracking-wider ${formData.experience === opt.id ? 'text-primary' : 'text-white'}`}>
                                                {opt.label}
                                            </h3>
                                            <p className="text-xs text-white/40 mt-1 uppercase">{opt.desc}</p>
                                        </div>
                                        <div className={formData.experience === opt.id ? 'text-primary' : 'text-white/30'}>
                                            {opt.icon}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Focus Area */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
                                    PICK YOUR <br />
                                    <span className="text-primary italic">PRIMARY FOCUS</span>
                                </h2>
                                <p className="text-white/60 text-sm mt-4 leading-relaxed">
                                    We'll optimize your drills around this strength.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'power', label: 'EXPLOSIVE POWER', icon: <Flame size={24} />, desc: 'Heavy striking force' },
                                    { id: 'speed', label: 'SPEED & REFLEXES', icon: <Zap size={24} />, desc: 'Fast combinations' },
                                    { id: 'footwork', label: 'FOOTWORK AGILITY', icon: <Wind size={24} />, desc: 'Movement patterns' },
                                    { id: 'cardio', label: 'CARDIO CONDITIONING', icon: <BarChart3 size={24} />, desc: 'Endurance building' },
                                ].map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, focus: opt.id })}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-start ${
                                            formData.focus === opt.id
                                                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]'
                                                : 'border-white/10 hover:border-white/20 bg-white/5'
                                        }`}
                                    >
                                        <div className={`mb-3 ${formData.focus === opt.id ? 'text-primary' : 'text-white/60'}`}>
                                            {opt.icon}
                                        </div>
                                        <h3 className={`text-lg font-black uppercase tracking-wider ${formData.focus === opt.id ? 'text-primary' : 'text-white'}`}>
                                            {opt.label}
                                        </h3>
                                        <p className="text-xs text-white/40 mt-1 uppercase">{opt.desc}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Equipment */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
                                    WHAT GEAR DO <br />
                                    <span className="text-primary italic">YOU HAVE</span>
                                </h2>
                                <p className="text-white/60 text-sm mt-4 leading-relaxed">
                                    Select all that apply. This ensures realistic drills.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'shadowbox', label: 'SHADOWBOXING ONLY', desc: 'No equipment needed' },
                                    { id: 'jump-rope', label: 'JUMP ROPE', desc: 'Cardio and footwork' },
                                    { id: 'heavy-bag', label: 'HEAVY BAG', desc: 'Power training' },
                                    { id: 'full-gym', label: 'FULL BOXING GYM', desc: 'All equipment available' },
                                ].map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => {
                                            if (formData.equipment.includes(opt.id)) {
                                                setFormData({
                                                    ...formData,
                                                    equipment: formData.equipment.filter(e => e !== opt.id)
                                                });
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    equipment: [...formData.equipment, opt.id]
                                                });
                                            }
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                                            formData.equipment.includes(opt.id)
                                                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]'
                                                : 'border-white/10 hover:border-white/20 bg-white/5'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <h3 className={`text-xl font-black uppercase tracking-wider ${formData.equipment.includes(opt.id) ? 'text-primary' : 'text-white'}`}>
                                                {opt.label}
                                            </h3>
                                            <p className="text-xs text-white/40 mt-1 uppercase">{opt.desc}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                            formData.equipment.includes(opt.id)
                                                ? 'border-primary bg-primary/20'
                                                : 'border-white/20'
                                        }`}>
                                            {formData.equipment.includes(opt.id) && (
                                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Duration */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
                                    HOW LONG CAN <br />
                                    <span className="text-primary italic">YOU TRAIN</span>
                                </h2>
                                <p className="text-white/60 text-sm mt-4 leading-relaxed">
                                    Daily session duration. We'll build your volume around this.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 15, label: '15 MINS', desc: 'Quick hits - high intensity' },
                                    { id: 30, label: '30 MINS', desc: 'Core workout - balanced' },
                                    { id: 45, label: '45 MINS', desc: 'Extended session - volume training' },
                                    { id: 60, label: '60+ MINS', desc: 'Full immersion - elite conditioning' },
                                ].map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, duration: opt.id })}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                                            formData.duration === opt.id
                                                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]'
                                                : 'border-white/10 hover:border-white/20 bg-white/5'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <h3 className={`text-xl font-black uppercase tracking-wider ${formData.duration === opt.id ? 'text-primary' : 'text-white'}`}>
                                                {opt.label}
                                            </h3>
                                            <p className="text-xs text-white/40 mt-1 uppercase">{opt.desc}</p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2" style={{
                                            borderColor: formData.duration === opt.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                                            backgroundColor: formData.duration === opt.id ? 'rgba(var(--primary-rgb),0.1)' : 'transparent'
                                        }}>
                                            {formData.duration === opt.id && (
                                                <div className="w-full h-full rounded-full bg-primary"></div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Frequency */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
                                    TRAINING <br />
                                    <span className="text-primary italic">FREQUENCY</span>
                                </h2>
                                <p className="text-white/60 text-sm mt-4 leading-relaxed">
                                    How many days per week can you commit to the ring?
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'light', label: '2-3 DAYS/WEEK', desc: 'Maintenance & skill building' },
                                    { id: 'moderate', label: '4-5 DAYS/WEEK', desc: 'Progressive strength building' },
                                    { id: 'intense', label: 'EVERYDAY', desc: 'Championship-level commitment' },
                                ].map((opt) => (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, frequency: opt.id })}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                                            formData.frequency === opt.id
                                                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]'
                                                : 'border-white/10 hover:border-white/20 bg-white/5'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <h3 className={`text-xl font-black uppercase tracking-wider ${formData.frequency === opt.id ? 'text-primary' : 'text-white'}`}>
                                                {opt.label}
                                            </h3>
                                            <p className="text-xs text-white/40 mt-1 uppercase">{opt.desc}</p>
                                        </div>
                                        <div className="w-6 h-6 rounded-lg border-2" style={{
                                            borderColor: formData.frequency === opt.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                                            backgroundColor: formData.frequency === opt.id ? 'rgba(var(--primary-rgb),0.1)' : 'transparent'
                                        }}>
                                            {formData.frequency === opt.id && (
                                                <svg className="w-full h-full text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-12 flex gap-4">
                    {step > 1 && (
                        <motion.button
                            onClick={handleBack}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 p-4 rounded-xl border border-white/20 text-white font-black uppercase text-sm tracking-wider hover:bg-white/5 transition-all"
                        >
                            <ChevronLeft size={20} className="inline mr-2" /> BACK
                        </motion.button>
                    )}
                    <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={
                            (step === 1 && !formData.experience) ||
                            (step === 2 && !formData.focus) ||
                            (step === 3 && formData.equipment.length === 0) ||
                            (step === 4 && formData.duration === 0) ||
                            (step === 5 && !formData.frequency) ||
                            loading
                        }
                        className={`flex-1 p-4 rounded-xl font-black uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2 ${
                            ((step === 1 && !formData.experience) ||
                                (step === 2 && !formData.focus) ||
                                (step === 3 && formData.equipment.length === 0) ||
                                (step === 4 && formData.duration === 0) ||
                                (step === 5 && !formData.frequency))
                                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                                : 'bg-primary text-black hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]'
                        }`}
                    >
                        {step === 5 ? 'GENERATE PLAN' : 'NEXT'}
                        <ChevronRight size={20} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default PlannerOnboarding;
