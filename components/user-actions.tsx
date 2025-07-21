"use client"

import { useState, useEffect } from "react"
import { Eye, Edit, Trash2, X, Loader2, User, Mail, Calendar, Shield, MoreHorizontal, UserCheck, UserX, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { deleteUserAction, updateUserStatusAction } from "@/lib/auth-actions"
import { EditUserForm } from "@/components/edit-user-form"
import { useAuth } from "@/context/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface User {
  uid: string
  email: string | null
  displayName: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  avatarColor?: string
  photoURL?: string
  createdBy?: string
}

interface UserActionsProps {
  user: User
  onUserUpdated: () => void
  onUserDeleted: () => void
}

export function UserActions({ user, onUserUpdated, onUserDeleted }: UserActionsProps) {
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user: currentUser, userRole } = useAuth()

  // Check if current user is admin
  const isAdmin = userRole === 'admin'
  const checkingRole = false // No longer needed since we have userRole directly

  // Check if user is trying to edit themselves
  const isEditingSelf = currentUser?.uid === user.uid

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Unknown'
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

  // Delete user function
  const handleDeleteUser = async () => {
    // Prevent users from deleting their own account
    if (isEditingSelf) {
      toast.error("You cannot delete your own account")
      return
    }

    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete ${user.displayName}? This action cannot be undone.`)) {
      return
    }

    try {
      setLoading(true)
      const result = await deleteUserAction(user.uid)
      
      if (result.success) {
        toast.success(`User ${user.displayName} deleted successfully`)
        onUserDeleted()
        setShowDeleteModal(false)
      } else {
        toast.error(result.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  // Handle edit user success
  const handleEditSuccess = () => {
    onUserUpdated()
    setShowEditModal(false)
  }

  // Handle edit user cancel
  const handleEditCancel = () => {
    setShowEditModal(false)
  }

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setShowViewModal(true)}
          title="View user details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        {/* Edit button - always visible but disabled if not admin or editing self */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowEditModal(true)}
                title="Edit user"
                disabled={!isAdmin || isEditingSelf}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isEditingSelf ? (
                <p>You cannot edit your own account</p>
              ) : !isAdmin ? (
                <p>Only administrators can edit users</p>
              ) : (
                <p>Edit user</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Delete button - disabled if not admin or deleting self */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive"
                onClick={() => setShowDeleteModal(true)}
                title="Delete user"
                disabled={!isAdmin || isEditingSelf}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isEditingSelf ? (
                <p>You cannot delete your own account</p>
              ) : !isAdmin ? (
                <p>Only administrators can delete users</p>
              ) : (
                <p>Delete user</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* View User Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">User Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowViewModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div 
                  className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${user.avatarColor || 'bg-gray-500'}`}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Role</p>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    {user.isActive ? (
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <UserX className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(user.isActive)}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">{formatDate(user.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-6">
                <div 
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${user.avatarColor || 'bg-gray-500'}`}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{user.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <EditUserForm
                user={user}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-destructive">Delete User</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div 
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${user.avatarColor || 'bg-gray-500'}`}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{user.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <p className="text-sm font-medium text-destructive mb-1">
                      Delete User Account
                    </p>
                    <p className="text-sm text-destructive/80">
                      This will permanently delete the user account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 