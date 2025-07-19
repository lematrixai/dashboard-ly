"use client"

import { ResetPasswordForm } from "@/components/reset-password-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()
  const router = useRouter()

  const handleResetPassword = async (data: { password: string; confirmPassword: string }) => {
    setIsLoading(true)
    setError(undefined)
    setSuccess(undefined)
    
    try {
      // TODO: Implement actual password reset logic here
      console.log('Password reset:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      setSuccess('Your password has been successfully reset. You can now sign in with your new password.')
      
      // Redirect to sign-in after a delay
      setTimeout(() => {
        router.push('/sign-in')
      }, 2000)
    } catch (err) {
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    router.push('/sign-in')
  }

  return (
    <AuthLayout>
      <ResetPasswordForm 
        onSubmit={handleResetPassword}
        isLoading={isLoading}
        error={error}
        success={success}
        onBackToSignIn={handleBackToSignIn}
      />
    </AuthLayout>
  )
} 