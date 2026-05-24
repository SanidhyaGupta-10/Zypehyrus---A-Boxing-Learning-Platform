import React from 'react';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { AnimatePresence, motion } from 'framer-motion';

// --- Onboarding Screens ---
import Welcome from './pages/onboarding/Welcome'; // Fighter Identity
import BioMetrics from './pages/onboarding/Problem'; // Bio Metrics
import Dominance from './pages/onboarding/FocusGoals'; // Goals
import Experience from './pages/onboarding/Solution'; // Rank
import Launch from './pages/onboarding/Launch'; // Final

// Note: I will map more pages as I build them. 
// For now, I'm fixing the content of the existing 9 slots to match the old design.

const OnboardingFlow: React.FC = () => {
    const { currentStep } = useOnboarding();

    const screens = [
        <Welcome />,      // 01/10 Photo
        <BioMetrics />,   // 02/10 Stats
        <Dominance />,    // 03/10 Goals
        <Experience />,   // 04/10 Rank
        <Launch />         // Placeholder for rest
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0a0a0c] min-h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-lg"
                >
                    {screens[currentStep - 1] || <Launch />}
                </motion.div>
            </AnimatePresence>

            {/* Modern thin progress indicator to match original UI */}
            <div className="fixed bottom-10 left-0 right-0 px-10 flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-[2px] flex-1 transition-all duration-500 ${i + 1 <= currentStep ? 'bg-primary' : 'bg-white/10'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <OnboardingProvider>
            <OnboardingFlow />
        </OnboardingProvider>
    );
};

export default App;
