"use client"

import React, { useEffect } from 'react'
import { useBreadcrumb } from '@/components/breadcrumb-context'

const Dashboard = () => {
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard" }
    ])
  }, [setBreadcrumbs])

  return (
    <div className="space-y-6 py-4 pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
          </div>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Tours</h3>
          </div>
          <div className="text-2xl font-bold">+2,350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Bookings</h3>
          </div>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Customer Satisfaction</h3>
          </div>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 md:col-span-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">New booking received</p>
                <p className="text-sm text-muted-foreground">Luxury Safari Tour - 2 guests</p>
              </div>
              <div className="text-sm text-muted-foreground">2 min ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Payment processed</p>
                <p className="text-sm text-muted-foreground">$2,450.00 - Wine Tour Package</p>
              </div>
              <div className="text-sm text-muted-foreground">5 min ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Tour cancellation</p>
                <p className="text-sm text-muted-foreground">Mountain Adventure - Weather conditions</p>
              </div>
              <div className="text-sm text-muted-foreground">10 min ago</div>
            </div>
          </div>
        </div>
        
        <div className="col-span-4 md:col-span-3 w-full rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Create New Tour
            </button>
            <button className="w-full rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
              View Bookings
            </button>
            <button className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/80">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard