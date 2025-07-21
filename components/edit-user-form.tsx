"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { updateUserAction } from "@/lib/auth-actions"
import { useAuth } from "@/context/auth-context"
import { Shield, User, Mail, UserCheck, UserX } from "lucide-react"

const editUserSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean()
})

type EditUserFormData = z.infer<typeof editUserSchema>

interface EditUserFormProps {
  user: {
    uid: string
    email: string | null
    displayName: string
    role: string
    isActive: boolean
  }
  onSuccess: () => void
  onCancel: () => void
}

export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const [loading, setLoading] = useState(false)
  const { user: currentUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      displayName: user.displayName,
      email: user.email || "",
      role: user.role as "admin" | "user",
      isActive: user.isActive
    }
  })

  const watchedRole = watch("role")
  const watchedIsActive = watch("isActive")

  const onSubmit = async (data: EditUserFormData) => {
    if (!currentUser) {
      toast.error("You must be logged in to edit users")
      return
    }

    // Prevent users from editing their own account
    if (currentUser.uid === user.uid) {
      toast.error("You cannot edit your own account")
      return
    }

    setLoading(true)
    try {
      const result = await updateUserAction({
        uid: user.uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        isActive: data.isActive,
        updatedBy: currentUser.uid
      })

      if (result.success) {
        toast.success(`User ${data.displayName} updated successfully`)
        onSuccess()
      } else {
        toast.error(result.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            {...register("displayName")}
            placeholder="Enter display name"
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
            placeholder="Enter email address"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={watchedRole}
            onValueChange={(value) => setValue("role", value as "admin" | "user")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2">
            <Badge className={getRoleColor(watchedRole)}>
              {watchedRole === 'admin' ? 'Admin' : 'User'}
            </Badge>
          </div>
        </div>

        <div>
          <Label htmlFor="isActive">Account Status</Label>
          <Select
            value={watchedIsActive.toString()}
            onValueChange={(value) => setValue("isActive", value === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2">
            <Badge className={getStatusColor(watchedIsActive)}>
              {watchedIsActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
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
          {loading ? "Updating..." : "Update User"}
        </Button>
      </div>
    </form>
  )
} 