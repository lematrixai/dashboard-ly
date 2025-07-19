import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

console.log('Firebase initialization started');

// Validate required environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDes1sTdhL-MvFkpwdTTWzZN0udMZjy9Yo",
  authDomain: "auth-441720.firebaseapp.com",
  projectId: "auth-441720",
  storageBucket: "auth-441720.firebasestorage.app",
  messagingSenderId: "750264092727",
  appId: "1:750264092727:web:d33fa34d0b81cd625497b2",
  measurementId: "G-950H8ZTPBC"
  };    

// Check for missing environment variables
const missingEnvVars = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
    console.log('Development environment detected');
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
        console.log('Connecting to Firebase emulators');
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
    }
}

console.log('Firebase initialization completed successfully');

export { app, auth, db };


