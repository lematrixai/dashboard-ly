"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const requirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "At least one uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "At least one lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "At least one number",
    test: (password) => /[0-9]/.test(password),
  },
  {
    label: "At least one special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
]

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [metRequirements, setMetRequirements] = useState<boolean[]>([])

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setMetRequirements(new Array(requirements.length).fill(false))
      return
    }

    const met = requirements.map((req) => req.test(password))
    setMetRequirements(met)
    
    const passedCount = met.filter(Boolean).length
    const strengthPercentage = (passedCount / requirements.length) * 100
    setStrength(strengthPercentage)
  }, [password])

  const getStrengthColor = (strength: number) => {
    if (strength === 0) return "bg-gray-200"
    if (strength <= 20) return "bg-red-500"
    if (strength <= 40) return "bg-orange-500"
    if (strength <= 60) return "bg-yellow-500"
    if (strength <= 80) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = (strength: number) => {
    if (strength === 0) return "Enter a password"
    if (strength <= 20) return "Very Weak"
    if (strength <= 40) return "Weak"
    if (strength <= 60) return "Fair"
    if (strength <= 80) return "Good"
    return "Strong"
  }

  if (!password) return null

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Password strength:</span>
          <span className={cn(
            "font-medium",
            strength >= 80 ? "text-green-600" : 
            strength >= 60 ? "text-blue-600" :
            strength >= 40 ? "text-yellow-600" :
            strength >= 20 ? "text-orange-600" : "text-red-600"
          )}>
            {getStrengthText(strength)}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              getStrengthColor(strength)
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Password requirements:
        </p>
        <div className="space-y-1">
          {requirements.map((requirement, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              {metRequirements[index] ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  metRequirements[index] 
                    ? "text-green-700" 
                    : "text-red-700"
                )}
              >
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 