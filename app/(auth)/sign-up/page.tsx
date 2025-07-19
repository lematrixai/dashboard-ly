"use client"

import { AuthForm } from "@/components/auth-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleRegister = async (data: { username?: string; email: string; password: string }) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      // TODO: Implement actual registration logic here
      console.log('Registration attempt:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, redirect to sign-in
      window.location.href = '/sign-in'
    } catch (err) {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeChange = (type: 'signin' | 'signup') => {
    if (type === 'signin') {
      router.push('/sign-in')
    }
  }

  return (
    <AuthLayout>
      <AuthForm 
        type="signup"
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
        onTypeChange={handleTypeChange}
      />
    </AuthLayout>
  )
}
