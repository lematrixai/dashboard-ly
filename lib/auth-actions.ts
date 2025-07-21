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
}

// Helper function to clear auth cookie
async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-user')
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