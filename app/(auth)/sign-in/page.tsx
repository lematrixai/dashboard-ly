"use client"

import { AuthForm } from "@/components/auth-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      // TODO: Implement actual login logic here
      console.log('Login attempt:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, redirect to dashboard
      window.location.href = '/'
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeChange = (type: 'signin' | 'signup') => {
    if (type === 'signup') {
      router.push('/sign-up')
    }
  }

  return (
    <AuthLayout>
      <AuthForm 
        type="signin"
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
        onTypeChange={handleTypeChange}
      />
    </AuthLayout>
  )
}
