"use client"

import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()
  const router = useRouter()

  const handleForgotPassword = async (data: { email: string }) => {
    setIsLoading(true)
    setError(undefined)
    setSuccess(undefined)
    
    try {
      // TODO: Implement actual password reset logic here
      console.log('Password reset request:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      setSuccess('Password reset link has been sent to your email address.')
    } catch (err) {
      setError('Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    router.push('/sign-in')
  }

  return (
    <AuthLayout>
      <ForgotPasswordForm 
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
        error={error}
        success={success}
        onBackToSignIn={handleBackToSignIn}
      />
    </AuthLayout>
  )
} 