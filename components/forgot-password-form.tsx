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
import { ArrowLeft, Mail } from 'lucide-react'

interface ForgotPasswordFormProps {
  className?: string
  onSubmit?: (data: { email: string }) => void
  isLoading?: boolean
  error?: string
  success?: string
  onBackToSignIn?: () => void
}

export function ForgotPasswordForm({
  className,
  onSubmit,
  isLoading = false,
  error,
  success,
  onBackToSignIn,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({ email })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Forgot your password?
          </CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
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
              
              {success && (
                <div className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800 dark:bg-green-900 dark:text-green-300">
                  {success}
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending reset link..." : "Send reset link"}
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