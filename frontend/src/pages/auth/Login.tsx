import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight, ArrowLeft, Loader2, CheckCircle2, ChevronDown, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const GUEST_KEY = 'boxing_guest_mode';

// ─── Country data ───────────────────────────────────────────────────────────
interface Country {
    name: string;
    flag: string;
    code: string;   // ISO 2-letter
    dial: string;   // e.g. "+91"
}

const COUNTRIES: Country[] = [
    { name: 'India', flag: '🇮🇳', code: 'IN', dial: '+91' },
    { name: 'United States', flag: '🇺🇸', code: 'US', dial: '+1' },
    { name: 'United Kingdom', flag: '🇬🇧', code: 'GB', dial: '+44' },
    { name: 'Australia', flag: '🇦🇺', code: 'AU', dial: '+61' },
    { name: 'Canada', flag: '🇨🇦', code: 'CA', dial: '+1' },
    { name: 'UAE', flag: '🇦🇪', code: 'AE', dial: '+971' },
    { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA', dial: '+966' },
    { name: 'Pakistan', flag: '🇵🇰', code: 'PK', dial: '+92' },
    { name: 'Bangladesh', flag: '🇧🇩', code: 'BD', dial: '+880' },
    { name: 'Sri Lanka', flag: '🇱🇰', code: 'LK', dial: '+94' },
    { name: 'Nepal', flag: '🇳🇵', code: 'NP', dial: '+977' },
    { name: 'Singapore', flag: '🇸🇬', code: 'SG', dial: '+65' },
    { name: 'Malaysia', flag: '🇲🇾', code: 'MY', dial: '+60' },
    { name: 'Philippines', flag: '🇵🇭', code: 'PH', dial: '+63' },
    { name: 'Indonesia', flag: '🇮🇩', code: 'ID', dial: '+62' },
    { name: 'Germany', flag: '🇩🇪', code: 'DE', dial: '+49' },
    { name: 'France', flag: '🇫🇷', code: 'FR', dial: '+33' },
    { name: 'Italy', flag: '🇮🇹', code: 'IT', dial: '+39' },
    { name: 'Spain', flag: '🇪🇸', code: 'ES', dial: '+34' },
    { name: 'Netherlands', flag: '🇳🇱', code: 'NL', dial: '+31' },
    { name: 'Brazil', flag: '🇧🇷', code: 'BR', dial: '+55' },
    { name: 'Mexico', flag: '🇲🇽', code: 'MX', dial: '+52' },
    { name: 'South Africa', flag: '🇿🇦', code: 'ZA', dial: '+27' },
    { name: 'Nigeria', flag: '🇳🇬', code: 'NG', dial: '+234' },
    { name: 'Kenya', flag: '🇰🇪', code: 'KE', dial: '+254' },
    { name: 'Japan', flag: '🇯🇵', code: 'JP', dial: '+81' },
    { name: 'South Korea', flag: '🇰🇷', code: 'KR', dial: '+82' },
    { name: 'China', flag: '🇨🇳', code: 'CN', dial: '+86' },
    { name: 'Russia', flag: '🇷🇺', code: 'RU', dial: '+7' },
    { name: 'Turkey', flag: '🇹🇷', code: 'TR', dial: '+90' },
    { name: 'New Zealand', flag: '🇳🇿', code: 'NZ', dial: '+64' },
    { name: 'Ireland', flag: '🇮🇪', code: 'IE', dial: '+353' },
    { name: 'Sweden', flag: '🇸🇪', code: 'SE', dial: '+46' },
    { name: 'Norway', flag: '🇳🇴', code: 'NO', dial: '+47' },
    { name: 'Denmark', flag: '🇩🇰', code: 'DK', dial: '+45' },
    { name: 'Switzerland', flag: '🇨🇭', code: 'CH', dial: '+41' },
    { name: 'Portugal', flag: '🇵🇹', code: 'PT', dial: '+351' },
    { name: 'Poland', flag: '🇵🇱', code: 'PL', dial: '+48' },
    { name: 'Israel', flag: '🇮🇱', code: 'IL', dial: '+972' },
    { name: 'Qatar', flag: '🇶🇦', code: 'QA', dial: '+974' },
    { name: 'Kuwait', flag: '🇰🇼', code: 'KW', dial: '+965' },
    { name: 'Bahrain', flag: '🇧🇭', code: 'BH', dial: '+973' },
    { name: 'Oman', flag: '🇴🇲', code: 'OM', dial: '+968' },
    { name: 'Egypt', flag: '🇪🇬', code: 'EG', dial: '+20' },
    { name: 'Ghana', flag: '🇬🇭', code: 'GH', dial: '+233' },
    { name: 'Tanzania', flag: '🇹🇿', code: 'TZ', dial: '+255' },
    { name: 'Ethiopia', flag: '🇪🇹', code: 'ET', dial: '+251' },
    { name: 'Argentina', flag: '🇦🇷', code: 'AR', dial: '+54' },
    { name: 'Colombia', flag: '🇨🇴', code: 'CO', dial: '+57' },
    { name: 'Chile', flag: '🇨🇱', code: 'CL', dial: '+56' },
    { name: 'Thailand', flag: '🇹🇭', code: 'TH', dial: '+66' },
    { name: 'Vietnam', flag: '🇻🇳', code: 'VN', dial: '+84' },
];

/** Map browser language tag → country code */
function detectCountry(): Country {
    try {
        const lang = navigator.language || 'en-IN';
        const region = lang.split('-')[1]?.toUpperCase();
        const match = COUNTRIES.find(c => c.code === region);
        return match ?? COUNTRIES[0]; // fallback: India
    } catch {
        return COUNTRIES[0];
    }
}

// ─── Country dropdown component ─────────────────────────────────────────────
interface CountryDropdownProps {
    selected: Country;
    onSelect: (c: Country) => void;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({ selected, onSelect }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Focus search box when dropdown opens
    useEffect(() => {
        if (open) setTimeout(() => searchRef.current?.focus(), 60);
        else setQuery('');
    }, [open]);

    const filtered = useMemo(() =>
        query.trim()
            ? COUNTRIES.filter(c =>
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.dial.includes(query)
            )
            : COUNTRIES,
        [query]
    );

    return (
        <div className="cc-wrap" ref={ref}>
            <button
                type="button"
                id="country-dropdown-btn"
                className="cc-trigger"
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="cc-flag">{selected.flag}</span>
                <span className="cc-dial">{selected.dial}</span>
                <ChevronDown size={13} className={`cc-chevron ${open ? 'open' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="cc-dropdown"
                        role="listbox"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                    >
                        {/* Search */}
                        <div className="cc-search-row">
                            <Search size={13} className="cc-search-icon" />
                            <input
                                ref={searchRef}
                                className="cc-search"
                                placeholder="Search country or code…"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                id="country-search"
                            />
                        </div>
                        <div className="cc-list">
                            {filtered.map(c => (
                                <button
                                    key={c.code + c.dial}
                                    type="button"
                                    role="option"
                                    aria-selected={c.code === selected.code}
                                    className={`cc-item ${c.code === selected.code ? 'active' : ''}`}
                                    onClick={() => { onSelect(c); setOpen(false); }}
                                >
                                    <span className="cc-flag">{c.flag}</span>
                                    <span className="cc-item-name">{c.name}</span>
                                    <span className="cc-item-dial">{c.dial}</span>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="cc-empty">No results for "{query}"</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── OTP digit boxes ─────────────────────────────────────────────────────────
const OtpInput: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace') {
            const digits = value.padEnd(6, '').split('').slice(0, 6);
            if (digits[idx]) {
                digits[idx] = '';
                onChange(digits.join(''));
            } else if (idx > 0) {
                refs.current[idx - 1]?.focus();
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        const digits = value.padEnd(6, '').split('').slice(0, 6);
        digits[idx] = char;
        onChange(digits.join(''));
        if (char && idx < 5) refs.current[idx + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted.padEnd(6, ''));
        refs.current[Math.min(pasted.length, 5)]?.focus();
        e.preventDefault();
    };

    return (
        <div className="otp-grid" onPaste={handlePaste} id="otp-input-group">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    id={`otp-digit-${i}`}
                    ref={el => { refs.current[i] = el; }}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKey(e, i)}
                    onFocus={e => e.target.select()}
                    className="otp-box"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                />
            ))}
        </div>
    );
};

// ─── Friendly error mapper ───────────────────────────────────────────────────
function mapError(raw: string): string {
    const msg = raw.toLowerCase();
    if (msg.includes('unsupported phone provider') || msg.includes('phone provider')) {
        return '📱 SMS provider not configured in Supabase yet.\n\nTo fix: Supabase Dashboard → Authentication → Providers → Phone, enable it and add a Twilio / MessageBird account.';
    }
    if (msg.includes('invalid') && msg.includes('otp')) return 'That code is wrong or expired. Check the SMS and try again.';
    if (msg.includes('expired')) return 'The code expired. Tap "Resend Code" to get a fresh one.';
    if (msg.includes('rate limit') || msg.includes('too many')) return 'Too many attempts. Please wait a minute and try again.';
    if (msg.includes('network') || msg.includes('fetch')) return 'Network error. Check your internet connection and retry.';
    return raw;
}

// ─── Zephyr SVG logo ─────────────────────────────────────────────────────────
const ZephyrLogo: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Zephyr logo">
        <polygon points="20,2 38,34 2,34" fill="none" stroke="#E2FF3B" strokeWidth="2.5" />
        <path d="M13 24 L27 16 L20 28" stroke="#E2FF3B" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
);

// ─── Main Login component ────────────────────────────────────────────────────
type Step = 'phone' | 'otp';

const Login: React.FC = () => {
    const [step, setStep] = useState<Step>('phone');
    const [country, setCountry] = useState<Country>(detectCountry);
    const [number, setNumber] = useState('');      // digits only, no country code
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const numberRef = useRef<HTMLInputElement>(null);

    // E.164: strip spaces/dashes then prepend dial code
    const fullPhone = useMemo(() => {
        const stripped = number.replace(/[\s\-().]/g, '');
        return `${country.dial}${stripped}`;
    }, [country, number]);

    // Auto-submit when 6 digits entered
    useEffect(() => {
        if (otp.replace(/\s/g, '').length === 6 && step === 'otp' && !loading) {
            handleVerifyOtp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    const handleSendOtp = async () => {
        setError('');
        const stripped = number.replace(/[\s\-().]/g, '');
        if (stripped.length < 6) {
            setError('Please enter your phone number (digits only, no country code).');
            return;
        }
        if (!supabase) {
            setError('Authentication service offline. Please try again later.');
            return;
        }
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.signInWithOtp({ phone: fullPhone });
            if (supaErr) throw supaErr;
            setStep('otp');
        } catch (err: unknown) {
            setError(mapError(err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        if (!supabase) {
            setError('Authentication service offline. Please try again later.');
            return;
        }
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.verifyOtp({
                phone: fullPhone,
                token: otp,
                type: 'sms',
            });
            if (supaErr) throw supaErr;
            setSuccess(true);
        } catch (err: unknown) {
            setError(mapError(err instanceof Error ? err.message : String(err)));
            setOtp('');
            setLoading(false);
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (success) {
        return (
            <motion.div
                className="login-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <CheckCircle2 size={72} color="#E2FF3B" />
                </motion.div>
                <h2 className="login-success-title">Identity Confirmed</h2>
                <p className="login-success-sub">Entering the ring…</p>
                <div className="login-spinner-row">
                    <Loader2 size={20} className="spin" color="#E2FF3B" />
                </div>
            </motion.div>
        );
    }

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div className="login-root" id="login-page">
            <div className="login-bg-glow" aria-hidden="true" />

            <div className="login-card">
                {/* Brand */}
                <header className="login-header">
                    <ZephyrLogo />
                    <div>
                        <div className="login-brand-tag">ZEPHYR AI</div>
                        <div className="login-brand-sub">BOXING INTELLIGENCE</div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {/* ── STEP 1: Phone entry ─────────────────────────────── */}
                    {step === 'phone' && (
                        <motion.div
                            key="phone-step"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                        >
                            <div className="login-step-label">STEP 01 / 02</div>
                            <h1 className="login-title">
                                Enter Your<br />
                                <span className="login-title-accent">Fight Number</span>
                            </h1>
                            <p className="login-desc">
                                We'll SMS a one-time code to verify your identity. No passwords ever.
                            </p>

                            {/* Combined phone row */}
                            <div className="phone-row">
                                <CountryDropdown selected={country} onSelect={c => { setCountry(c); numberRef.current?.focus(); }} />
                                <input
                                    id="phone-number-input"
                                    ref={numberRef}
                                    type="tel"
                                    inputMode="numeric"
                                    className="phone-number-input"
                                    placeholder="98765 43210"
                                    value={number}
                                    onChange={e => setNumber(e.target.value.replace(/[^0-9\s\-().]/g, ''))}
                                    onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                                    autoComplete="tel-national"
                                    autoFocus
                                />
                            </div>

                            <div className="login-hint">
                                Full number: <strong className="login-phone-display">{fullPhone || `${country.dial} ···`}</strong>
                            </div>

                            {error && (
                                <div className="login-error" role="alert">
                                    {error.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>{line}{i < error.split('\n').length - 1 && <br />}</React.Fragment>
                                    ))}
                                </div>
                            )}

                            <button
                                id="send-otp-btn"
                                className="login-btn-primary"
                                onClick={handleSendOtp}
                                disabled={loading || number.replace(/[\s\-().]/g, '').length < 6}
                                aria-busy={loading}
                            >
                                {loading
                                    ? <Loader2 size={20} className="spin" />
                                    : <>Send OTP Code <ChevronRight size={20} /></>
                                }
                            </button>

                            {/* ── Guest bypass ───────────────────────────────── */}
                            <div className="login-divider">
                                <span>or</span>
                            </div>
                            <button
                                id="guest-continue-btn"
                                className="login-guest-btn"
                                onClick={() => {
                                    localStorage.setItem(GUEST_KEY, 'true');
                                    window.location.reload();
                                }}
                                disabled={loading}
                            >
                                Continue as Guest
                            </button>
                            <p className="login-guest-note">
                                You can link your phone number later in Settings.
                            </p>
                        </motion.div>
                    )}


                    {/* ── STEP 2: OTP verify ──────────────────────────────── */}
                    {step === 'otp' && (
                        <motion.div
                            key="otp-step"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                        >
                            <button
                                className="login-back-btn"
                                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                                aria-label="Go back to phone entry"
                            >
                                <ArrowLeft size={16} /> <span>Change Number</span>
                            </button>

                            <div className="login-step-label">STEP 02 / 02</div>
                            <h1 className="login-title">
                                Verify Your<br />
                                <span className="login-title-accent">Combat Code</span>
                            </h1>
                            <p className="login-desc">
                                6-digit code sent to&nbsp;
                                <strong className="login-phone-display">{fullPhone}</strong>
                            </p>

                            <div className="login-otp-wrapper">
                                <Shield size={18} className="login-otp-icon" />
                                <OtpInput value={otp} onChange={setOtp} />
                            </div>

                            {error && (
                                <div className="login-error" role="alert">
                                    {error.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>{line}{i < error.split('\n').length - 1 && <br />}</React.Fragment>
                                    ))}
                                </div>
                            )}

                            <button
                                id="verify-otp-btn"
                                className="login-btn-primary"
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.replace(/\s/g, '').length < 6}
                                aria-busy={loading}
                            >
                                {loading
                                    ? <Loader2 size={20} className="spin" />
                                    : <>Verify &amp; Launch Training <ChevronRight size={20} /></>
                                }
                            </button>

                            <button
                                id="resend-otp-btn"
                                className="login-resend-btn"
                                onClick={() => { setOtp(''); setError(''); handleSendOtp(); }}
                                disabled={loading}
                            >
                                Resend Code
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="login-dots" role="progressbar" aria-valuenow={step === 'phone' ? 1 : 2} aria-valuemin={1} aria-valuemax={2}>
                <div className={`login-dot ${step === 'phone' ? 'active' : 'done'}`} />
                <div className={`login-dot ${step === 'otp' ? 'active' : ''}`} />
            </div>
        </div>
    );
};

export default Login;
