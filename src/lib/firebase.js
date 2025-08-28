// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh0OjEQ2q1Pfypc-tOPPaJg0bHNzQaaPc",
  authDomain: "sagachat-3cfaf.firebaseapp.com",
  projectId: "sagachat-3cfaf",
  storageBucket: "sagachat-3cfaf.firebasestorage.app",
  messagingSenderId: "1035940942432",
  appId: "1:1035940942432:web:7cf07b666dc7e3fd74a905",
  measurementId: "G-EXYPTFEJFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize analytics in production and when supported
let analytics;
try {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Analytics not available:', error);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { createUserWithEmailAndPassword };
