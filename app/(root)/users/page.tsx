"use client"

import React, { useEffect, useState } from 'react'
import { Search, Plus, Users, Edit, Trash2, Eye, Mail, Calendar, X, Loader2, RefreshCw, UserPlus, Filter, Users2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBreadcrumb } from '@/components/breadcrumb-context'
import { CreateUserForm } from '@/components/create-user-form'
import { UserActions } from '@/components/user-actions'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'

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

const UsersPage = () => {
  const { setBreadcrumbs } = useBreadcrumb()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Users" }
    ])
  }, [setBreadcrumbs])

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersRef = collection(db, 'users')
      const q = query(usersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const usersData: User[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        usersData.push({
          uid: doc.id,
          email: data.email,
          displayName: data.displayName || 'Unknown User',
          role: data.role || 'user',
          isActive: data.isActive !== false, // Default to true
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          avatarColor: data.avatarColor,
          photoURL: data.photoURL,
          createdBy: data.createdBy
        })
      })
      
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6 py-4 pt-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Users</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage user accounts and profiles
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

            <Button 
              variant="outline"
              onClick={fetchUsers}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full sm:w-auto"
            >
              Add User
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span>Users ({filteredUsers.length})</span>
          {searchTerm && (
            <span className="text-sm font-normal text-muted-foreground">
              filtered from {users.length} total
            </span>
          )}
        </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first user to get started'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create First User
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px] lg:min-w-[1000px]">
                <Table>
                  <TableHeader>
                                      <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div 
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${user.avatarColor || 'bg-gray-500'}`}
                            >
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">{user.displayName}</div>
                              <div className="text-sm text-muted-foreground sm:hidden">
                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                  </Badge>
                                  <Badge className={getStatusColor(user.isActive ? 'Active' : 'Inactive')}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(user.createdAt)}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={getRoleColor(user.role === 'admin' ? 'Admin' : 'User')}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={getStatusColor(user.isActive ? 'Active' : 'Inactive')}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(user.updatedAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <UserActions
                            user={user}
                            onUserUpdated={fetchUsers}
                            onUserDeleted={fetchUsers}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create New User</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <CreateUserForm
                onSuccess={() => {
                  setShowCreateForm(false)
                  fetchUsers() // Refresh the users list
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage 