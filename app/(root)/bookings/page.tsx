"use client"

import React, { useEffect } from 'react'
import { Search, Plus, Calendar, Edit, Trash2, Eye } from 'lucide-react'
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

const Bookings = () => {
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Bookings" }
    ])
  }, [setBreadcrumbs])

  const bookings = [
    {
      id: 1,
      customer: "John Smith",
      destination: "Santorini, Greece",
      date: "2024-06-15",
      guests: 2,
      status: "Confirmed",
      amount: "$2,450",
      bookingDate: "2024-01-15",
    },
    {
      id: 2,
      customer: "Sarah Johnson",
      destination: "Swiss Alps",
      date: "2024-07-20",
      guests: 4,
      status: "Pending",
      amount: "$3,200",
      bookingDate: "2024-01-20",
    },
    {
      id: 3,
      customer: "Mike Davis",
      destination: "Tokyo, Japan",
      date: "2024-08-10",
      guests: 1,
      status: "Confirmed",
      amount: "$1,800",
      bookingDate: "2024-01-18",
    },
    {
      id: 4,
      customer: "Emily Wilson",
      destination: "Machu Picchu",
      date: "2024-09-05",
      guests: 3,
      status: "Cancelled",
      amount: "$2,100",
      bookingDate: "2024-01-22",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6 py-4 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bookings</h1>
          <p className="text-muted-foreground">Manage customer bookings and reservations</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Destination</TableHead>
                    <TableHead className="hidden md:table-cell">Travel Date</TableHead>
                    <TableHead className="hidden md:table-cell">Guests</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="font-medium truncate line-clamp-1">{booking.customer}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            <span className="inline-flex items-center gap-1">
                              <span>{booking.destination}</span>
                              <span>•</span>
                              <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                              <span>•</span>
                              <span>{booking.amount}</span>
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">Booked: {booking.bookingDate}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{booking.destination}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="font-medium">{booking.amount}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="outline" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Bookings 