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
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

interface AuthFormProps {
  className?: string
  type?: 'signin' | 'signup'
  onSubmit?: (data: { username?: string; email: string; password: string }) => void
  isLoading?: boolean
  error?: string
  onTypeChange?: (type: 'signin' | 'signup') => void
}

export function AuthForm({
  className,
  type = 'signin',
  onSubmit,
  isLoading = false,
  error,
  onTypeChange,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      const submitData = type === 'signin' 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password }
      onSubmit(submitData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTypeChange = () => {
    const newType = type === 'signin' ? 'signup' : 'signin'
    if (onTypeChange) {
      onTypeChange(newType)
    }
  }

  const isSignIn = type === 'signin'
  const isSignUp = type === 'signup'

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isSignIn ? 'Login to your account' : 'Create an account'}
          </CardTitle>
          <CardDescription>
            {isSignIn 
              ? 'Enter your email below to login to your account'
              : 'Enter your details below to create your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              {isSignUp && (
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required={isSignUp}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isSignIn && (
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
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
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (isSignIn ? "Signing in..." : "Creating account...") 
                  : (isSignIn ? "Login" : "Create account")
                }
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <div className="flex items-center justify-center">
                <span className="text-muted-foreground">
                  {isSignIn ? "Don't have an account?" : "Already have an account?"}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm ml-1"
                  onClick={handleTypeChange}
                  disabled={isLoading}
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
