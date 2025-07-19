'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
    
    redirect('/sign-in')
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