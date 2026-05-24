import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import firebaseConfig from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check if user is logged in
export const checkAuthState = (callback) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(true, user);
        } else {
            callback(false, null);
        }
    });
};

// Register with Email
export const registerWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Sync onboarding data if it exists
        const onboardingData = JSON.parse(localStorage.getItem('boxing_onboarding_data') || '{}');
        if (Object.keys(onboardingData).length > 0) {
            await saveUserProfile(user.uid, onboardingData);
            localStorage.removeItem('boxing_onboarding_data');
        }

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Simple Email Login
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Save User Profile Data
export const saveUserProfile = async (uid, data) => {
    try {
        await setDoc(doc(db, "users", uid), data, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Logout
export const logoutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('boxing_guru_logged_in');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

export { auth, db };
