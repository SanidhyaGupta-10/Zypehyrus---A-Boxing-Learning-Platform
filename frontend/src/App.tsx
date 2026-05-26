import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { redirectToDashboard } from './lib/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import Login from './pages/auth/Login';

import Welcome from './pages/onboarding/Welcome';
import BioMetrics from './pages/onboarding/Problem';
import Dominance from './pages/onboarding/FocusGoals';
import Experience from './pages/onboarding/Solution';
import TimeSlot from './pages/onboarding/TimeSlot';
import GearCheck from './pages/onboarding/GearCheck';
import FightingStance from './pages/onboarding/FightingStance';
import CoreDriver from './pages/onboarding/CoreDriver';
import Intensity from './pages/onboarding/Intensity';
import Frequency from './pages/onboarding/Frequency';
import Promise from './pages/onboarding/Promise';

const GUEST_KEY = 'boxing_guest_mode';

function isOnboardingComplete(): boolean {
    if (localStorage.getItem('boxing_onboarding_done') === 'true') return true;
    try {
        const data = JSON.parse(localStorage.getItem('boxing_onboarding_data') || '{}');
        return !!data.onboarding_completed;
    } catch {
        return false;
    }
}

const OnboardingFlow: React.FC = () => {
    const { currentStep, totalSteps } = useOnboarding();

    const screens = [
        <Welcome />,
        <BioMetrics />,
        <Dominance />,
        <Experience />,
        <TimeSlot />,
        <GearCheck />,
        <FightingStance />,
        <CoreDriver />,
        <Intensity />,
        <Frequency />,
        <Promise />,
    ];

    const progressSteps = totalSteps;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0a0a0c] min-h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full max-w-lg"
                >
                    {screens[currentStep - 1] || <Promise />}
                </motion.div>
            </AnimatePresence>

            <div className="fixed bottom-10 left-0 right-0 px-10 flex gap-1">
                {Array.from({ length: progressSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-[2px] flex-1 transition-all duration-500 ${
                            i + 1 <= Math.min(currentStep, progressSteps) ? 'bg-primary' : 'bg-white/10'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

const AppGate: React.FC = () => {
    const { session, loading } = useAuth();
    const isGuest = localStorage.getItem(GUEST_KEY) === 'true';

    useEffect(() => {
        if (!loading && (session || isGuest) && isOnboardingComplete()) {
            redirectToDashboard();
        }
    }, [session, loading, isGuest]);

    if (loading) {
        return (
            <div
                id="auth-loading-screen"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0A0A0A',
                    gap: '16px',
                }}
            >
                <Loader2 size={40} color="#E2FF3B" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#888', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    Initialising…
                </p>
            </div>
        );
    }

    if (!session && !isGuest) {
        return <Login />;
    }

    if (isOnboardingComplete()) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] gap-4">
                <Loader2 size={40} color="#E2FF3B" style={{ animation: 'spin 1s linear infinite' }} />
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Entering dashboard…</p>
            </div>
        );
    }

    return (
        <OnboardingProvider>
            <OnboardingFlow />
        </OnboardingProvider>
    );
};

const App: React.FC = () => (
    <AuthProvider>
        <AppGate />
    </AuthProvider>
);

export default App;
