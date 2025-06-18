import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "symmdiv2-plus.firebaseapp.com",
  projectId: "symmdiv2-plus",
  storageBucket: "symmdiv2-plus.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope("email");
googleProvider.addScope("profile");

export const authService = {
  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        },
      };
    } catch (error) {
      console.error("Google sign in error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
};

export default authService;
