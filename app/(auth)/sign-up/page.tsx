"use client"

import { AuthSignUpForm } from "@/components/auth-signup-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type SignUpFormData } from "@/lib/validations/auth"
import { useAuth } from "@/context/auth-context"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/Dashboard'
  const { signUp } = useAuth()

  const handleRegister = async (data: SignUpFormData) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      // Use auth-context signUp function
      await signUp(data.email, data.password)
      
      // Redirect to intended destination or dashboard
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeChange = (type: 'signin' | 'signup') => {
    if (type === 'signin') {
      const signInUrl = redirectTo ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}` : '/sign-in'
      router.push(signInUrl)
    }
  }

  return (
    <AuthLayout>
      <AuthSignUpForm 
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
        onTypeChange={handleTypeChange}
      />
    </AuthLayout>
  )
}
