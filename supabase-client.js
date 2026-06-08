import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Get environment variables from Vite or window globals
let supabaseUrl = undefined;
let supabaseAnonKey = undefined;

// Try Vite env first
try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY;
    }
} catch (e) {
    // Vite env not available, will use window globals
}

// Try window globals
if (!supabaseUrl && typeof window !== 'undefined') {
    supabaseUrl = window.VITE_SUPABASE_URL;
}
if (!supabaseAnonKey && typeof window !== 'undefined') {
    supabaseAnonKey = window.VITE_SUPABASE_ANON_KEY || window.VITE_SUPABASE_KEY;
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Credentials missing. Supabase will be unavailable. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

