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
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { setUserCookieAction, signOutAction } from "@/lib/auth-actions"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
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
      return 'An account already exists with this email'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    case 'auth/invalid-email':
      return 'Please enter a valid email address'
    default:
      return error.message || 'An error occurred during authentication'
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

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Set server-side cookie
      await setUserCookieAction({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      })
      
      router.push("/")
      toast.success("Account created successfully!")
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      throw error
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
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      await signOutAction() // This will clear server-side cookie and redirect
      toast.success("Signed out successfully!")
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
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