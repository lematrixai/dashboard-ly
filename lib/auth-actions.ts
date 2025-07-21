'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { resetUserPassword, getUserByEmail } from './firebaseAdmin'

// Helper function to set secure cookie
async function setAuthCookie(userData: string, expiresIn: number) {
  const cookieStore = await cookies()
  cookieStore.set('auth-user', userData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  })
  console.log('Auth cookie set successfully')
}

// Helper function to clear auth cookie
async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-user')
  console.log('Auth cookie cleared successfully')
}

// Server action to set user data in cookie (called from client after successful auth)
export async function setUserCookieAction(userData: any) {
  try {
    await setAuthCookie(JSON.stringify(userData), 60 * 60 * 24 * 7) // 7 days
    return { success: true }
  } catch (error) {
    console.error('Set cookie error:', error)
    throw new Error('Failed to set authentication cookie')
  }
}

// Server action for user sign out
export async function signOutAction() {
  try {
    // Clear auth cookie
    await clearAuthCookie()
  } catch (error: any) {
    console.error('Sign out error:', error)
    throw new Error('Failed to sign out')
  }
}

// Server action to verify authentication
export async function verifyAuthAction() {
  const cookieStore = await cookies()
  const userData = cookieStore.get('auth-user')?.value

  if (!userData) {
    return { isAuthenticated: false, user: null }
  }

  try {
    const user = JSON.parse(userData)
    return {
      isAuthenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    }
  } catch (error) {
    console.error('Token verification error:', error)
    // Clear invalid token
    await clearAuthCookie()
    return { isAuthenticated: false, user: null }
  }
}

// Server action to get current user
export async function getCurrentUserAction() {
  const cookieStore = await cookies()
  const userData = cookieStore.get('auth-user')?.value

  if (!userData) {
    return null
  }

  try {
    const user = JSON.parse(userData)
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Server action to reset password for existing user
export async function resetExistingUserPasswordAction(email: string, newPassword: string) {
  try {
    const result = await resetUserPassword(email, newPassword)
    return result
  } catch (error: any) {
    console.error('Reset password action error:', error)
    return {
      success: false,
      message: error.message || 'Failed to reset password'
    }
  }
}

// Server action to get user info
export async function getUserInfoAction(email: string) {
  try {
    const result = await getUserByEmail(email)
    return result
  } catch (error: any) {
    console.error('Get user info action error:', error)
    return {
      success: false,
      message: error.message || 'Failed to get user info'
    }
  }
}

// Server action to create user (admin only)
export async function createUserAction(userData: {
  email: string
  password: string
  displayName: string
  role: string
  createdBy: string
}) {
  try {
    // Import Firebase Admin functions
    const { getAuth } = await import('firebase-admin/auth')
    const { getFirestore } = await import('firebase-admin/firestore')
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    
    // Initialize Firebase Admin if not already done
    if (getApps().length === 0) {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required')
      }
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      initializeApp({
        credential: cert(serviceAccount),
      })
    }
    
    const adminAuth = getAuth()
    const db = getFirestore()
    
    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    })
    
    // Create user document in Firestore
    const userRef = db.collection('users').doc(userRecord.uid)
    await userRef.set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL || '',
      avatarColor: getAvatarColorForUser(userRecord.uid, userRecord.email || undefined),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: userData.role,
      isActive: true,
      createdBy: userData.createdBy
    })
    
    return {
      success: true,
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    }
  } catch (error: any) {
    console.error('Create user action error:', error)
    return {
      success: false,
      message: error.message || 'Failed to create user'
    }
  }
}

// Server action to get current user's role
export async function getCurrentUserRoleAction(uid: string) {
  try {
    // Import Firebase Admin functions
    const { getFirestore } = await import('firebase-admin/firestore')
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    
    // Initialize Firebase Admin if not already done
    if (getApps().length === 0) {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required')
      }
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      initializeApp({
        credential: cert(serviceAccount),
      })
    }
    
    const db = getFirestore()
    
    // Get user document from Firestore
    const userDoc = await db.collection('users').doc(uid).get()
    
    if (!userDoc.exists) {
      return { success: false, message: 'User not found' }
    }
    
    const userData = userDoc.data()
    
    return {
      success: true,
      role: userData?.role || 'user',
      isActive: userData?.isActive || false
    }
  } catch (error: any) {
    console.error('Get current user role action error:', error)
    return {
      success: false,
      message: error.message || 'Failed to get user role'
    }
  }
}

// Server action to update user (admin only)
export async function updateUserAction(userData: {
  uid: string
  email?: string
  displayName?: string
  role?: string
  isActive?: boolean
  updatedBy: string
}) {
  try {
    // Import Firebase Admin functions
    const { getAuth } = await import('firebase-admin/auth')
    const { getFirestore } = await import('firebase-admin/firestore')
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    
    // Initialize Firebase Admin if not already done
    if (getApps().length === 0) {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required')
      }
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      initializeApp({
        credential: cert(serviceAccount),
      })
    }
    
    const adminAuth = getAuth()
    const db = getFirestore()
    
    // Verify that the user making the update is an admin
    const adminUserDoc = await db.collection('users').doc(userData.updatedBy).get()
    if (!adminUserDoc.exists) {
      // If admin user document doesn't exist, try to get from Firebase Auth
      try {
        const adminUserRecord = await adminAuth.getUser(userData.updatedBy)
        // If user exists in Auth but not in Firestore, create the document
        const adminUserData = {
          uid: adminUserRecord.uid,
          email: adminUserRecord.email,
          displayName: adminUserRecord.displayName || '',
          photoURL: adminUserRecord.photoURL || '',
          avatarColor: getAvatarColorForUser(adminUserRecord.uid, adminUserRecord.email || undefined),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: 'admin', // Assume admin if they're trying to update users
          isActive: true
        }
        await db.collection('users').doc(userData.updatedBy).set(adminUserData)
        console.log('Created missing admin user document')
      } catch (error) {
        console.error('Error creating admin user document:', error)
        throw new Error('Admin user not found and could not be created')
      }
    } else {
      const adminUserData = adminUserDoc.data()
      if (adminUserData?.role !== 'admin') {
        throw new Error('Only administrators can update user information')
      }
    }
    
    // Get current user data
    const userDoc = await db.collection('users').doc(userData.uid).get()
    if (!userDoc.exists) {
      throw new Error('User not found')
    }
    
    const currentUserData = userDoc.data()
    
    // Prepare update data for Firestore
    const firestoreUpdateData: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: userData.updatedBy
    }
    
    // Prepare update data for Firebase Auth
    const authUpdateData: any = {}
    
    // Update display name if provided
    if (userData.displayName !== undefined && userData.displayName !== currentUserData?.displayName) {
      firestoreUpdateData.displayName = userData.displayName
      authUpdateData.displayName = userData.displayName
    }
    
    // Update email if provided
    if (userData.email !== undefined && userData.email !== currentUserData?.email) {
      firestoreUpdateData.email = userData.email
      authUpdateData.email = userData.email
    }
    
    // Update role if provided (only admins can change roles)
    if (userData.role !== undefined && userData.role !== currentUserData?.role) {
      // Validate role
      if (!['admin', 'user'].includes(userData.role)) {
        throw new Error('Invalid role. Must be either "admin" or "user"')
      }
      
      // If changing from admin to user, check if this is the last active admin
      if (currentUserData?.role === 'admin' && userData.role === 'user') {
        // Only check if the user being changed is currently active
        if (currentUserData?.isActive) {
          const adminUsers = await db.collection('users')
            .where('role', '==', 'admin')
            .where('isActive', '==', true)
            .get()
          
          if (adminUsers.size <= 1) {
            throw new Error('Cannot remove the last active administrator from the system')
          }
        }
      }
      
      firestoreUpdateData.role = userData.role
    }
    
    // Update active status if provided
    if (userData.isActive !== undefined && userData.isActive !== currentUserData?.isActive) {
      firestoreUpdateData.isActive = userData.isActive
    }
    
    // Update Firestore document
    await db.collection('users').doc(userData.uid).update(firestoreUpdateData)
    
    // Update Firebase Auth user (only if auth data needs updating)
    if (Object.keys(authUpdateData).length > 0) {
      await adminAuth.updateUser(userData.uid, authUpdateData)
    }
    
    return {
      success: true,
      message: 'User updated successfully',
      updatedFields: Object.keys(firestoreUpdateData).filter(key => key !== 'updatedAt' && key !== 'updatedBy')
    }
  } catch (error: any) {
    console.error('Update user action error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update user'
    }
  }
}

// Server action to update user status (admin only)
export async function updateUserStatusAction(uid: string, isActive: boolean) {
  try {
    // Import Firebase Admin functions
    const { getFirestore } = await import('firebase-admin/firestore')
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    
    // Initialize Firebase Admin if not already done
    if (getApps().length === 0) {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required')
      }
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      initializeApp({
        credential: cert(serviceAccount),
      })
    }
    
    const db = getFirestore()
    
    // Update user document in Firestore
    await db.collection('users').doc(uid).update({
      isActive: isActive,
      updatedAt: new Date().toISOString()
    })
    
    return {
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    }
  } catch (error: any) {
    console.error('Update user status action error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update user status'
    }
  }
}

// Server action to delete user (admin only)
export async function deleteUserAction(uid: string) {
  try {
    // Import Firebase Admin functions
    const { getAuth } = await import('firebase-admin/auth')
    const { getFirestore } = await import('firebase-admin/firestore')
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    
    // Initialize Firebase Admin if not already done
    if (getApps().length === 0) {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required')
      }
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      initializeApp({
        credential: cert(serviceAccount),
      })
    }
    
    const adminAuth = getAuth()
    const db = getFirestore()
    
    // Get user data before deletion to check if it's an admin
    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data()
    
    // If deleting an admin, check if this is the last admin
    if (userData?.role === 'admin' && userData?.isActive) {
      const adminUsers = await db.collection('users')
        .where('role', '==', 'admin')
        .where('isActive', '==', true)
        .get()
      
      if (adminUsers.size <= 1) {
        throw new Error('Cannot delete the last active administrator from the system')
      }
    }
    
    // Delete user from Firebase Auth
    await adminAuth.deleteUser(uid)
    
    // Delete user document from Firestore
    await db.collection('users').doc(uid).delete()
    
    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error: any) {
    console.error('Delete user action error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete user'
    }
  }
}

// Helper function to get avatar color (same as in auth-context)
const getAvatarColorForUser = (uid?: string, email?: string) => {
  const AVATAR_COLORS = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500",
    "bg-red-500", "bg-yellow-500", "bg-teal-500", "bg-orange-500", "bg-cyan-500",
    "bg-emerald-500", "bg-violet-500", "bg-rose-500", "bg-amber-500", "bg-lime-500",
    "bg-sky-500", "bg-fuchsia-500", "bg-slate-500", "bg-gray-500", "bg-zinc-500"
  ]
  
  const seed = uid || email || "default"
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
} 