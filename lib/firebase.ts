// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDes1sTdhL-MvFkpwdTTWzZN0udMZjy9Yo",
  authDomain: "auth-441720.firebaseapp.com",
  projectId: "auth-441720",
  storageBucket: "auth-441720.firebasestorage.app",
  messagingSenderId: "750264092727",
  appId: "1:750264092727:web:d33fa34d0b81cd625497b2",
  measurementId: "G-950H8ZTPBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app; 