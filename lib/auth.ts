import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthError {
  code: string;
  message: string;
}

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> => {
  try {
    console.log('Attempting to register user:', { email, displayName });
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }

    console.log('User registered successfully:', user.uid);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw {
      code: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Sign in user
export const signInUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    console.log('Attempting to sign in user:', { email });
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User signed in successfully:', user.uid);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw {
      code: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw {
      code: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Error message mapping
const getErrorMessage = (errorCode: string): string => {
  console.log('Processing error code:', errorCode);
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign in is not enabled.';
    default:
      console.log('Unknown error code:', errorCode);
      return `Authentication error: ${errorCode}`;
  }
}; 