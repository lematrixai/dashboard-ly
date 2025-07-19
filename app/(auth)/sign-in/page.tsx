"use client"

import { AuthSignInForm } from "@/components/auth-signin-form"
import { AuthLayout } from "@/components/auth-layout"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setUserCookieAction, resetExistingUserPasswordAction, getUserInfoAction } from "@/lib/auth-actions"
import { type SignInFormData } from "@/lib/validations/auth"
import { useAuth } from "@/context/auth-context"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/Dashboard'
  const { signIn } = useAuth()

  const handleLogin = async (data: SignInFormData) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      // Use auth-context signIn function
      await signIn(data.email, data.password)
      
      // Redirect to intended destination or dashboard
      router.push(redirectTo)
    } catch (err: any) {
      console.error('Login error in component:', err);
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

  // Reset password for existing user
  const resetExistingUserPassword = async () => {
    console.log('Resetting password for erickbale360@gmail.com...');
    const newPassword = 'Test123!@#';
    const result = await resetExistingUserPasswordAction('erickbale360@gmail.com', newPassword);
    console.log('Password reset result:', result);
    if (result.success) {
      setError(`Password reset successful! Use: erickbale360@gmail.com / ${newPassword}`);
    } else {
      setError(`Password reset failed: ${result.message}`);
    }
  }

  // Get user info
  const getUserInfo = async () => {
    console.log('Getting user info for erickbale360@gmail.com...');
    const result = await getUserInfoAction('erickbale360@gmail.com');
    console.log('User info result:', result);
    if (result.success && 'user' in result) {
      setError(`User found: ${JSON.stringify(result.user, null, 2)}`);
    } else {
      setError(`Get user info failed: ${result.message}`);
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
        
        {/* Debug buttons - remove in production */}
        <div className="text-center space-y-2">
          <button
            onClick={() => {}}
            className="text-xs text-muted-foreground hover:text-foreground block"
          >
            Test Firebase Connection
          </button>
          <button
            onClick={() => {}}
            className="text-xs text-muted-foreground hover:text-foreground block"
          >
            Create Test User
          </button>
          <button
            onClick={resetExistingUserPassword}
            className="text-xs text-muted-foreground hover:text-foreground block"
          >
            Reset Password for erickbale360@gmail.com
          </button>
          <button
            onClick={getUserInfo}
            className="text-xs text-muted-foreground hover:text-foreground block"
          >
            Get User Info
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
