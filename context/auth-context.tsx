"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { toast } from "sonner"
import { setUserCookieAction, signOutAction } from "@/lib/auth-actions"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getAuthErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password'
    case 'auth/user-not-found':
      return 'No account found with this email'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead or use a different email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    case 'auth/invalid-email':
      return 'Please enter a valid email address'
    default:
      return error.message || 'An error occurred during authentication'
  }
}

// Professional background colors for avatars (same as in emoji-avatar.tsx)
const AVATAR_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500",
  "bg-red-500", "bg-yellow-500", "bg-teal-500", "bg-orange-500", "bg-cyan-500",
  "bg-emerald-500", "bg-violet-500", "bg-rose-500", "bg-amber-500", "bg-lime-500",
  "bg-sky-500", "bg-fuchsia-500", "bg-slate-500", "bg-gray-500", "bg-zinc-500"
]

// Get avatar color for user
const getAvatarColorForUser = (uid?: string, email?: string) => {
  const seed = uid || email || "default"
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

// Create user document in Firestore
const createUserDocument = async (user: User, displayName?: string) => {
  try {
    console.log('Creating user document for:', user.uid)
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      // Get avatar color for the user
      const avatarColor = getAvatarColorForUser(user.uid, user.email || undefined)
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        avatarColor: avatarColor, // Store the avatar color
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user',
        isActive: true
      }
      
      console.log('Setting user document with data:', userData)
      await setDoc(userRef, userData)
      console.log('User document created successfully')
    } else {
      console.log('User document already exists')
    }
  } catch (error) {
    console.error('Error creating user document:', error)
    // Don't throw the error - just log it so signup can continue
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('Auth state changed:', user ? 'User logged in' : 'User logged out')
          setUser(user)
          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Auth initialization error:", error)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user, displayName)
      
      // Set server-side cookie
      await setUserCookieAction({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      })
      
      router.push("/")
      toast.success("Account created successfully!")
      return null // Success, no error
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      return errorMessage // Return the useful error message
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Set server-side cookie
      await setUserCookieAction({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      })
      
      router.push("/")
      toast.success("Signed in successfully!")
      return null // Success, no error
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      return errorMessage // Return the useful error message
    }
  }

  const signOut = async () => {
    try {
      console.log('Starting sign out process...')
      await firebaseSignOut(auth)
      console.log('Firebase sign out completed')
      await signOutAction() // This will clear server-side cookie
      console.log('Server cookie cleared')
      toast.success("Signed out successfully!")
      
      // Small delay to ensure cookie is cleared before redirect
      setTimeout(() => {
        console.log('Redirecting to sign-in...')
        router.push('/sign-in') // Client-side redirect to sign-in
      }, 100)
      
      // Fallback redirect in case the first one doesn't work
      setTimeout(() => {
        if (window.location.pathname !== '/sign-in') {
          console.log('Fallback redirect to sign-in...')
          window.location.href = '/sign-in'
        }
      }, 500)
    } catch (error: any) {
      console.error('Sign out error:', error)
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      // Even if there's an error, try to redirect to sign-in
      router.push('/sign-in')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 