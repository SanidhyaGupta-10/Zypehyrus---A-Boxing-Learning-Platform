import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { ChevronRight } from 'lucide-react';

const BioMetrics: React.FC = () => {
    const { data, updateData, nextStep } = useOnboarding();

    return (
        <div className="flex flex-col min-h-[80vh] justify-between py-4">
            <header className="text-left mb-6">
                <div className="text-[10px] font-black tracking-[4px] text-primary mb-3 uppercase">ONBOARDING 02/10</div>
                <h1 className="text-5xl font-bold leading-tight">
                    Fighter <br /> <span className="text-primary italic font-black">Bio-Metrics</span>
                </h1>
                <p className="text-text-muted mt-4 text-sm leading-relaxed pr-10">
                    This data feeds the engine to calculate training intensity and impact safety.
                </p>
            </header>

            <main className="flex-1 flex flex-col gap-6 py-6">
                {[
                    { label: 'Ring Name', key: 'ringName', placeholder: 'e.g. TITAN', type: 'text' },
                    { label: 'Phone Number', key: 'phone', placeholder: '+1...', type: 'tel' },
                    { label: 'Age', key: 'age', placeholder: 'YEARS', type: 'number' },
                    { label: 'Weight (KG)', key: 'weight', placeholder: 'KG', type: 'number' },
                    { label: 'Height (CM)', key: 'height', placeholder: 'CM', type: 'number' }
                ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-2">
                        <label className="text-[10px] font-black tracking-widest text-primary uppercase">{field.label}</label>
                        <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={(data as any)[field.key] || ''}
                            onChange={(e) => updateData({ [field.key]: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 py-2 text-2xl font-bold outline-none focus:border-primary transition-all pb-1 tracking-tight"
                        />
                    </div>
                ))}
            </main>

            <footer className="mt-8">
                <button onClick={nextStep} className="btn-primary w-full h-16 flex items-center justify-center gap-2">
                    CONTINUE <ChevronRight size={20} />
                </button>
                <p className="text-[10px] text-center mt-6 text-primary/40 tracking-[0.2em] font-black uppercase">
                    Secure Enclave Active
                </p>
            </footer>
        </div>
    );
};

export default BioMetrics;
