import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';

const EnvironmentCheck: React.FC = () => {
    const { nextStep, prevStep } = useOnboarding();

    const checks = [
        "At least 6-8 feet of clear floor space",
        "Bright, even lighting (no backlighting)",
        "Device positioned at waist height",
        "Full body visible in camera frame"
    ];

    return (
        <div className="flex flex-col items-center text-center gap-8">
            <h2 className="text-3xl font-bold uppercase">Space Prep</h2>
            <p className="text-text-muted">Ensure your training environment is optimized for AI tracking.</p>

            <div className="flex flex-col w-full gap-3">
                {checks.map((check, i) => (
                    <div key={i} className="glass-card flex items-center gap-4 text-left border-white/5">
                        <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span className="text-sm font-medium">{check}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col w-full gap-4 mt-8">
                <button onClick={nextStep} className="btn-primary w-full">
                    SYNC CAMERA
                </button>
                <button onClick={prevStep} className="text-text-muted hover:text-white transition-colors">
                    BACK
                </button>
            </div>
        </div>
    );
};

export default EnvironmentCheck;
