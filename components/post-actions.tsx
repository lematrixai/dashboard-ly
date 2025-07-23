"use client"

import { useState } from "react"
import { Eye, Edit, Trash2, Loader2, FileText, Calendar, User, Eye as EyeIcon, Play, Image as ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { MediaPreviewDrawer } from "./media-preview-drawer"
import { useRouter } from "next/navigation"

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

interface PostActionsProps {
  post: Post
  onPostUpdated: () => void
  onPostDeleted: () => void
}

export function PostActions({ post, onPostUpdated, onPostDeleted }: PostActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showMediaPreview, setShowMediaPreview] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: 'image' | 'video', name: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Check if current user is the author
  const isAuthor = user?.uid === post.authorId

  // Format date for display
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

  // Delete post function
  const handleDeletePost = async () => {
    if (!isAuthor) {
      toast.error("You can only delete your own posts")
      return
    }

    try {
      setLoading(true)
      await deleteDoc(doc(db, 'posts', post.id))
      
      onPostDeleted()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View post details</p>
            </TooltipContent>
          </Tooltip>

          {isAuthor && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push(`/posts/${post.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit post</p>
                </TooltipContent>
              </Tooltip>

                             <Tooltip>
                 <TooltipTrigger asChild>
                   <Button
                     variant="destructive"
                     size="icon"
                     className="h-8 w-8"
                     onClick={() => setShowDeleteModal(true)}
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent>
                   <p>Delete post</p>
                 </TooltipContent>
               </Tooltip>
            </>
          )}
        </TooltipProvider>
      </div>

      

      {/* Delete Post Modal */}
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
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            <div>
              <h3 className="font-semibold w-40 truncate">{post.title}</h3>
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
    </>
  )
} 