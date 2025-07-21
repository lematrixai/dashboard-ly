"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { User, Mail, UserCheck } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { updateProfile } from "firebase/auth"

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: {
    uid: string
    email: string | null
    displayName: string | null
  }
  onSuccess: () => void
  onCancel: () => void
}

export function ProfileForm({ user, onSuccess, onCancel }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const { user: currentUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user.displayName || "",
      email: user.email || "",
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    if (!currentUser) {
      toast.error("You must be logged in to update your profile")
      return
    }

    setLoading(true)
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: data.displayName
      })

      // Update Firestore document
      const userDocRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userDocRef, {
        displayName: data.displayName,
        email: data.email,
        updatedAt: new Date().toISOString()
      })

      toast.success("Profile updated successfully")
      onSuccess()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            {...register("displayName")}
            placeholder="Enter your display name"
            className={errors.displayName ? "border-red-500" : ""}
          />
          {errors.displayName && (
            <p className="text-sm text-red-500 mt-1">{errors.displayName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter your email address"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  )
} 