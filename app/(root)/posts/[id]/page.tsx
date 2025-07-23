"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Eye, Calendar, User, FileText, Download, ExternalLink, Play, Pause, Volume2, VolumeX, Maximize2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { MediaPreviewDrawer } from "@/components/media-preview-drawer"

interface Post {
  id: string
  title: string
  content: string
  authorName: string
  authorId: string
  status: 'draft' | 'published' | 'scheduled'
  category: string
  views: number
  mediaUrls: string[]
  createdAt: any
  updatedAt: any
  publishedAt: any
  scheduledDate?: string
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showMediaPreview, setShowMediaPreview] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: 'image' | 'video', name: string} | null>(null)

  const postId = params.id as string

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const postDoc = await getDoc(doc(db, 'posts', postId))
      
      if (postDoc.exists()) {
        setPost({ id: postDoc.id, ...postDoc.data() } as Post)
      } else {
        toast.error('Post not found')
        router.push('/posts')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load post')
      router.push('/posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!post || !user || user.uid !== post.authorId) {
      toast.error("You can only delete your own posts")
      return
    }

    try {
      setDeleting(true)
      await deleteDoc(doc(db, 'posts', post.id))
      
      toast.success(`Post "${post.title}" deleted successfully`)
      router.push('/posts')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown'
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">The requested post could not be found.</p>
          <Button onClick={() => router.push('/posts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </div>
      </div>
    )
  }

  const isAuthor = user?.uid === post.authorId

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/posts')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Button>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">Post Details</p>
            </div>
          </div>
          
          {isAuthor && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/posts/${post.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Post Header */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="secondary">{post.category}</Badge>
                    <Badge className={getStatusColor(post.status)}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Media Gallery */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Media Files ({post.mediaUrls.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {post.mediaUrls.map((url, index) => (
                    <div key={index} className="group relative aspect-square rounded-lg border overflow-hidden bg-muted/20">
                      {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <>
                          <img
                            src={url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/90 text-black hover:bg-white"
                                onClick={() => {
                                  setSelectedMedia({
                                    url,
                                    type: 'image',
                                    name: `Image ${index + 1}`
                                  })
                                  setShowMediaPreview(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/90 text-black hover:bg-white"
                                onClick={() => {
                                  setSelectedMedia({
                                    url,
                                    type: 'video',
                                    name: `Video ${index + 1}`
                                  })
                                  setShowMediaPreview(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/90 text-black hover:bg-white"
                                onClick={(e) => {
                                  e.preventDefault()
                                  const video = e.currentTarget.parentElement?.parentElement?.parentElement?.querySelector('video')
                                  if (video) {
                                    if (video.paused) {
                                      video.play()
                                    } else {
                                      video.pause()
                                    }
                                  }
                                }}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Play
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* File type indicator */}
                      <div className="absolute top-2 left-2">
                        {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <FileText className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                        ) : (
                          <FileText className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Post Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Author</p>
                      <p className="text-sm font-medium">{post.authorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>

                  {post.updatedAt && (
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">{formatDate(post.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Category</p>
                      <p className="text-sm font-medium">{post.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Views</p>
                      <p className="text-sm font-medium">{post.views.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ResponsiveDialog 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal}
        title="Delete Post"
        showFooter={true}
        footerContent={
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              disabled={deleting}
              className="flex-1"
            >
              {deleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Post
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <h3 className="font-semibold truncate w-40">{post.title}</h3>
              <p className="text-sm text-muted-foreground">{post.authorName}</p>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div>
                <p className="text-sm font-medium text-destructive mb-1">
                  Delete Post
                </p>
                <p className="text-sm text-destructive/80">
                  This will permanently delete the post and all associated media. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveDialog>

      {/* Media Preview Drawer */}
      {selectedMedia && (
        <MediaPreviewDrawer
          open={showMediaPreview}
          onOpenChange={setShowMediaPreview}
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          fileName={selectedMedia.name}
        />
      )}
    </div>
  )
} 