"use client"

import { useAuth } from "@/context/auth-context"
import { useBreadcrumb } from '@/components/breadcrumb-context'
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    console.log('Dashboard: User state:', user ? user.email : 'null', 'Loading:', loading)
    setBreadcrumbs([
      { label: "Dashboard" }
    ])
  }, [user, loading, setBreadcrumbs])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Dashboard...</h1>
          <p className="text-muted-foreground">Please wait while we load your dashboard.</p>
        </div>
      </div>
    )
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.displayName || user.email}!
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            +0 from last month
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Destinations</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            +0 from last month
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Bookings</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            +0 from last month
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Posts</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            +0 from last month
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
        <div className="space-y-2 text-sm">
          <p><strong>User ID:</strong> {user.uid}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
          <p><strong>Photo URL:</strong> {user.photoURL || 'Not set'}</p>
          <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
          <p><strong>Loading State:</strong> {loading ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}