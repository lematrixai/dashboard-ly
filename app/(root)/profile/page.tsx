"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from "@/context/auth-context"
import { useBreadcrumb } from '@/components/breadcrumb-context'
import { ProfileForm } from '@/components/profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProfessionalAvatar } from '@/components/ui/emoji-avatar'
import { Separator } from '@/components/ui/separator'
import { Calendar, Mail, Shield, User, UserCheck, UserX } from 'lucide-react'

export default function ProfilePage() {
  const { user, userRole } = useAuth()
  const { setBreadcrumbs } = useBreadcrumb()
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Profile" }
    ])
  }, [setBreadcrumbs])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p className="text-muted-foreground">You need to be logged in to view this page.</p>
        </div>
      </div>
    )
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

  // Convert Firebase User to EmojiAvatar user format
  const emojiUser = {
    uid: user.uid,
    email: user.email || undefined,
    displayName: user.displayName || undefined,
    photoURL: user.photoURL || undefined
  }

  return (
    <div className="space-y-6 p-6 mt-8 bg-background rounded-lg border shadow-sm">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Profile</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              View and manage your account information
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center space-y-4">
              <ProfessionalAvatar user={emojiUser} size="lg" className="h-24 w-24 rounded-full" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{user.displayName || 'No name set'}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            {/* User Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <Badge className={getRoleColor(userRole || 'user')}>
                      {userRole === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge className={getStatusColor(true)}>
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {user.metadata?.creationTime ? 
                      new Date(user.metadata.creationTime).toLocaleDateString() : 
                      'Unknown'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form or Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {showEditForm ? 'Edit Profile' : 'Account Details'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showEditForm ? (
              <ProfileForm 
                user={user}
                onSuccess={() => setShowEditForm(false)}
                onCancel={() => setShowEditForm(false)}
              />
            ) : (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You can edit your profile information here. Changes will be applied to your account.
                  </p>
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 