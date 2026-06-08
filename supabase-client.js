import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Try to get from import.meta.env (Vite), window globals, or fallback to null
const getEnv = (key) => {
    if (typeof import !== 'undefined' && import.meta && import.meta.env) {
        return import.meta.env[key];
    }
    if (typeof window !== 'undefined') {
        return window[key];
    }
    return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Credentials missing. Supabase will be unavailable. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

