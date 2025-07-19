"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/auth';
import { setUserCookieAction, signOutAction, verifyAuthAction } from '@/lib/auth-actions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check server-side authentication first
    const checkServerAuth = async () => {
      try {
        const authResult = await verifyAuthAction();
        if (mounted && authResult.isAuthenticated && authResult.user) {
          // Convert server user data to Firebase User format
          const firebaseUser = {
            uid: authResult.user.uid,
            email: authResult.user.email,
            displayName: authResult.user.displayName,
            photoURL: authResult.user.photoURL,
          } as User;
          setUser(firebaseUser);
        }
      } catch (error) {
        console.error('Server auth check failed:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkServerAuth();

    // Listen to client-side Firebase auth changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (!mounted) return;

      if (firebaseUser) {
        // User signed in - update server cookie
        try {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          await setUserCookieAction(userData);
        } catch (error) {
          console.error('Failed to set user cookie:', error);
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error('Sign out failed:', error);
      // Fallback to client-side sign out
      try {
        const { signOut: firebaseSignOut } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        await firebaseSignOut(auth);
        setUser(null);
      } catch (fallbackError) {
        console.error('Fallback sign out failed:', fallbackError);
      }
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 