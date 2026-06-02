import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env ?? {};
const supabaseUrl =
    (env.NEXT_PUBLIC_SUPABASE_URL as string) ||
    (env.VITE_SUPABASE_URL as string) ||
    '';
const supabaseAnonKey =
    (env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
    (env.VITE_SUPABASE_ANON_KEY as string) ||
    (env.VITE_SUPABASE_KEY as string) ||
    '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '[Supabase] Missing environment variables. ' +
        'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set.'
    );
}

// Singleton Supabase client — import this everywhere instead of creating new instances
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
