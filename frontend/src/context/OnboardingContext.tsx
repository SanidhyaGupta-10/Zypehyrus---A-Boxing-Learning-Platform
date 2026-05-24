import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingData {
    ringName: string;
    phone: string;
    age: number;
    height: number;
    weight: number;
    goals: string[];
    promiseWord: string;
    hasCompletedOnboarding: boolean;
}

interface OnboardingContextType {
    data: OnboardingData;
    updateData: (newData: Partial<OnboardingData>) => void;
    syncToSupabase: () => Promise<void>;
    nextStep: () => void;
    prevStep: () => void;
    currentStep: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        ringName: '',
        phone: '',
        age: 25,
        height: 175,
        weight: 75,
        goals: [],
        promiseWord: '',
        hasCompletedOnboarding: false,
    });

    const updateData = (newData: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const syncToSupabase = async () => {
        console.log('Syncing onboarding data to Supabase:', data);
        updateData({ hasCompletedOnboarding: true });
    };

    return (
        <OnboardingContext.Provider value={{ data, updateData, syncToSupabase, currentStep, nextStep, prevStep }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
