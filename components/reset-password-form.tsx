"use client"

import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react'

interface ResetPasswordFormProps {
  className?: string
  onSubmit?: (data: { password: string; confirmPassword: string }) => void
  isLoading?: boolean
  error?: string
  success?: string
  onBackToSignIn?: () => void
}

export function ResetPasswordForm({
  className,
  onSubmit,
  isLoading = false,
  error,
  success,
  onBackToSignIn,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [validationError, setValidationError] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(undefined)
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long')
      return
    }
    
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(undefined)
    }
  }

  const displayError = error || validationError

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Reset your password
          </CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {displayError && (
                <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
                  {displayError}
                </div>
              )}
              
              {success && (
                <div className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800 dark:bg-green-900 dark:text-green-300">
                  {success}
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting password..." : "Reset password"}
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={onBackToSignIn}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back to sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 