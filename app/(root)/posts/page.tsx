"use client"

import React, { useEffect } from 'react'
import { Search, Plus, FileText, Edit, Trash2, Eye, Calendar } from 'lucide-react'
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

const Posts = () => {
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Posts" }
    ])
  }, [setBreadcrumbs])

  const posts = [
    {
      id: 1,
      title: "Top 10 Destinations for 2024",
      author: "Travel Expert",
      status: "Published",
      category: "Travel Guide",
      views: 1245,
      publishDate: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: 2,
      title: "Budget Travel Tips for Europe",
      author: "Budget Traveler",
      status: "Draft",
      category: "Tips & Tricks",
      views: 0,
      publishDate: null,
      lastModified: "2024-01-22",
    },
    {
      id: 3,
      title: "Luxury Hotels in Paris",
      author: "Luxury Guide",
      status: "Published",
      category: "Accommodation",
      views: 892,
      publishDate: "2024-01-10",
      lastModified: "2024-01-18",
    },
    {
      id: 4,
      title: "Adventure Travel Safety Guide",
      author: "Safety Expert",
      status: "Scheduled",
      category: "Safety",
      views: 0,
      publishDate: "2024-02-01",
      lastModified: "2024-01-25",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6 py-4 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts and content</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Views</TableHead>
                    <TableHead className="hidden md:table-cell">Publish Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{post.title}</div>
                            <div className="text-sm text-muted-foreground md:hidden">
                              <span className="inline-flex items-center gap-1">
                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                  {post.category}
                                </Badge>
                                <span>•</span>
                                <span>{post.author}</span>
                                <span>•</span>
                                <span>{post.views.toLocaleString()} views</span>
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">Modified: {post.lastModified}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{post.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {post.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{post.publishDate || 'Not published'}</span>
                        </div>
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

export default Posts 