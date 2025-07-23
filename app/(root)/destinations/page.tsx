"use client"

import React, { useEffect } from 'react'
import { Search, Plus, MapPin, Edit, Trash2 } from 'lucide-react'
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

const Destinations = () => {
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Destinations" }
    ])
  }, [setBreadcrumbs])

  const destinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      country: "Greece",
      type: "Beach",
      status: "Active",
      bookings: 156,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Swiss Alps",
      country: "Switzerland", 
      type: "Mountain",
      status: "Active",
      bookings: 89,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Tokyo, Japan",
      country: "Japan",
      type: "City",
      status: "Active",
      bookings: 234,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Machu Picchu",
      country: "Peru",
      type: "Cultural",
      status: "Active",
      bookings: 67,
      rating: 4.9,
    },
  ]

  return (
    <div className="space-y-6 py-4 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Destinations</h1>
          <p className="text-muted-foreground">Manage your travel destinations and locations</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Destination
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead className="hidden md:table-cell">Country</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Bookings</TableHead>
                    <TableHead className="hidden md:table-cell">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.map((destination) => (
                    <TableRow key={destination.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="font-medium truncate line-clamp-1">{destination.name}</div>
                            <div className="text-sm text-muted-foreground md:hidden">
                              <span className="inline-flex items-center gap-1">
                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                  {destination.type}
                                </Badge>
                                <span>•</span>
                                <span>{destination.country}</span>
                                <span>•</span>
                                <span>{destination.bookings} bookings</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{destination.country}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{destination.type}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                          {destination.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{destination.bookings}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <span className="font-medium">{destination.rating}</span>
                          <span className="text-muted-foreground ml-1">/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
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

export default Destinations 