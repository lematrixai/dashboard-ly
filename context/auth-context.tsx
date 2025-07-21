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
import { setUserCookieAction, signOutAction, createUserAction, getCurrentUserRoleAction } from "@/lib/auth-actions"

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: string | null
  signUp: (email: string, password: string, displayName?: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  createUser: (email: string, password: string, displayName: string, role?: string) => Promise<string | null>
  getUserRole: () => Promise<string | null>
  refreshUserRole: () => Promise<void>
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
  const [initialized, setInitialized] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        await setPersistence(auth, browserLocalPersistence)
        console.log('Auth persistence set to browserLocalPersistence')
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out')
          
          if (user) {
            // User is logged in - ensure cookie is set
            try {
              console.log('Setting user cookie for:', user.email)
              await setUserCookieAction({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
              })
              console.log('User cookie set successfully')
              
              // Get user role from Firestore
              try {
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                if (userDoc.exists()) {
                  const userData = userDoc.data()
                  const role = userData.role || 'user'
                  setUserRole(role)
                } else {
                  // If user document doesn't exist, create it with admin role
                  // This handles the case where admin users don't have a Firestore document
                  const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    avatarColor: getAvatarColorForUser(user.uid, user.email || undefined),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    role: 'admin', // Assume admin if they're trying to access user management
                    isActive: true
                  }
                  await setDoc(doc(db, 'users', user.uid), userData)
                  setUserRole('admin')
                }
              } catch (error) {
                console.error('Error fetching user role from Firestore:', error)
                setUserRole('admin') // Fallback to admin for user management access
              }
            } catch (error) {
              console.error('Failed to set user cookie:', error)
              // Don't fail the auth state change if cookie setting fails
            }
          } else {
            // User is logged out - ensure cookie is cleared
            try {
              console.log('Clearing user cookie')
              await signOutAction()
              console.log('User cookie cleared successfully')
            } catch (error) {
              console.error('Failed to clear user cookie:', error)
              // Don't fail the auth state change if cookie clearing fails
            }
            setUserRole(null)
          }
          
          setUser(user)
          setLoading(false)
          setInitialized(true)
          console.log('Auth state updated, loading set to false, initialized set to true')
        }, (error) => {
          console.error('Auth state change error:', error)
          setLoading(false)
          setInitialized(true)
        })

        return () => {
          console.log('Cleaning up auth listener')
          unsubscribe()
        }
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
      
      // Clear server-side cookie first
      await signOutAction()
      console.log('Server cookie cleared')
      
      // Then sign out from Firebase
      await firebaseSignOut(auth)
      console.log('Firebase sign out completed')
      
      toast.success("Signed out successfully!")
      
      // Redirect to sign-in page
      console.log('Redirecting to sign-in...')
      router.push('/sign-in')
      
    } catch (error: any) {
      console.error('Sign out error:', error)
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
      
      // Even if there's an error, try to redirect to sign-in
      router.push('/sign-in')
    }
  }

  const createUser = async (email: string, password: string, displayName: string, role: string = 'user') => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create users')
      }
      
      // Use server action to create user with admin privileges
      const result = await createUserAction({
        email,
        password,
        displayName,
        role,
        createdBy: user.uid
      })
      
      if (result.success) {
        toast.success(`User ${displayName} created successfully!`)
        return null // Success, no error
      } else {
        toast.error(result.message || 'Failed to create user')
        return result.message
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while creating the user'
      toast.error(errorMessage)
      return errorMessage
    }
  }

  const getUserRole = async (): Promise<string | null> => {
    // Return the stored role instead of calling server action
    return userRole
  }

  const refreshUserRole = async () => {
    if (!user?.uid) {
      return
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const role = userData.role || 'user'
        setUserRole(role)
        console.log('User role refreshed from Firestore:', role)
      } else {
        setUserRole('user')
        console.log('User document not found during refresh, defaulting to user role')
      }
    } catch (error) {
      console.error('Error refreshing user role:', error)
      setUserRole('user')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading: loading || !initialized, userRole, signUp, signIn, signOut, createUser, getUserRole, refreshUserRole }}>
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