"use client"

import { AuthSignInForm } from "@/components/auth-signin-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInUser } from "@/lib/auth"
import { setUserCookieAction } from "@/lib/auth-actions"
import { type SignInFormData } from "@/lib/validations/auth"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/Dashboard'

  const handleLogin = async (data: SignInFormData) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      // Sign in with Firebase
      const user = await signInUser(data.email, data.password)
      
      // Set server-side cookie
      await setUserCookieAction({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      })
      
      // Redirect to intended destination or dashboard
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeChange = (type: 'signin' | 'signup') => {
    if (type === 'signup') {
      const signUpUrl = redirectTo ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}` : '/sign-up'
      router.push(signUpUrl)
    }
  }

  return (
    <AuthLayout>
      <AuthSignInForm 
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
        onTypeChange={handleTypeChange}
      />
    </AuthLayout>
  )
}
