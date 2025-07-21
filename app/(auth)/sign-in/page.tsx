"use client"

import { AuthSignInForm } from "@/components/auth-signin-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { type SignInFormData } from "@/lib/validations/auth"
import { useAuth } from "@/context/auth-context"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const { signIn } = useAuth()

  const handleLogin = async (data: SignInFormData) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      // Use auth-context signIn function
      const errorMessage = await signIn(data.email, data.password)
      
      if (errorMessage) {
        setError(errorMessage)
      }
      // If no error message, signin was successful and user was redirected
    } catch (err: any) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
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
      <div className="space-y-4">
        <AuthSignInForm 
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
          onTypeChange={handleTypeChange}
        />
      </div>
    </AuthLayout>
  )
}
