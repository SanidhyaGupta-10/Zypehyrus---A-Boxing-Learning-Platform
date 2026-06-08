import { supabase } from "./supabase-client.js";

// Check if user is logged in
export const checkAuthState = (callback) => {
    if (!supabase) {
        callback(false, null);
        return;
    }
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            callback(true, session.user);
        } else {
            callback(false, null);
        }
    });
};

// Register with Email
export const registerWithEmail = async (email, password) => {
    try {
        if (!supabase) throw new Error('Database offline. Registration unavailable.');
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;

        // Sync onboarding data if it exists
        const onboardingData = JSON.parse(localStorage.getItem('boxing_onboarding_data') || '{}');
        if (Object.keys(onboardingData).length > 0) {
            await saveUserProfile(data.user.id, onboardingData);
            localStorage.removeItem('boxing_onboarding_data');
        }

        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Simple Email Login
export const loginWithEmail = async (email, password) => {
    try {
        if (!supabase) throw new Error('Database offline. Login unavailable.');
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Save User Profile Data
export const saveUserProfile = async (uid, data) => {
    try {
        if (!supabase) throw new Error('Database offline. Profile sync unavailable.');
        const { error } = await supabase
            .from('profiles')
            .upsert({ id: uid, ...data });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Logout
export const logoutUser = async () => {
    try {
        if (supabase) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem('boxing_guru_logged_in');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

export { supabase as db }; // Exporting as db for backwards compatibility in UI files


