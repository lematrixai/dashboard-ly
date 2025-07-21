"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Professional background colors for avatars
const AVATAR_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500",
  "bg-red-500", "bg-yellow-500", "bg-teal-500", "bg-orange-500", "bg-cyan-500",
  "bg-emerald-500", "bg-violet-500", "bg-rose-500", "bg-amber-500", "bg-lime-500",
  "bg-sky-500", "bg-fuchsia-500", "bg-slate-500", "bg-gray-500", "bg-zinc-500"
]

interface ProfessionalAvatarProps {
  user?: {
    uid?: string
    email?: string
    displayName?: string
    photoURL?: string
  } | null
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function ProfessionalAvatar({ user, className, size = "md" }: ProfessionalAvatarProps) {
  // Get consistent color based on user UID or email
  const getAvatarColor = (uid?: string, email?: string) => {
    const seed = uid || email || "default"
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    const index = Math.abs(hash) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
  }

  // Get initials from display name or email
  const getInitials = (displayName?: string, email?: string) => {
    if (displayName) {
      return displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.charAt(0).toUpperCase()
    }
    return "?"
  }

  const avatarColor = getAvatarColor(user?.uid, user?.email)
  const initials = getInitials(user?.displayName, user?.email)

  const sizeClasses = {
    sm: "size-6 text-xs",
    md: "size-8 text-sm",
    lg: "size-10 text-base",
    xl: "size-12 text-lg"
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {user?.photoURL ? (
        <AvatarImage src={user.photoURL} alt={user.displayName || "User avatar"} />
      ) : null}
      <AvatarFallback className={cn("text-white font-semibold", avatarColor)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

// Hook to get avatar color for a user
export function useAvatarColor(user?: { uid?: string; email?: string } | null) {
  const getAvatarColor = (uid?: string, email?: string) => {
    const seed = uid || email || "default"
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    const index = Math.abs(hash) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
  }

  return getAvatarColor(user?.uid, user?.email)
}

// Hook to get initials for a user
export function useUserInitials(user?: { displayName?: string; email?: string } | null) {
  const getInitials = (displayName?: string, email?: string) => {
    if (displayName) {
      return displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.charAt(0).toUpperCase()
    }
    return "?"
  }

  return getInitials(user?.displayName, user?.email)
} 