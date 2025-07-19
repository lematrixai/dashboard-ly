import React from 'react'
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn("flex min-h-svh w-full items-center justify-center p-6 md:p-10", className)}>
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  )
} 