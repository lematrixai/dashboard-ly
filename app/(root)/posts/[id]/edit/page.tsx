"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { EditPostForm } from "@/components/edit-post-form"

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

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  const postId = params.id as string

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const postDoc = await getDoc(doc(db, 'posts', postId))
      
      if (postDoc.exists()) {
        const postData = { id: postDoc.id, ...postDoc.data() } as Post
        
        // Check if user is the author
        if (user?.uid !== postData.authorId) {
          toast.error("You can only edit your own posts")
          router.push(`/posts/${postId}`)
          return
        }
        
        setPost(postData)
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

  const handleEditSuccess = () => {
    toast.success('Post updated successfully!')
    router.push(`/posts/${postId}`)
  }

  const handleEditCancel = () => {
    router.push(`/posts/${postId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/posts/${postId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Post
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Edit Post</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="w-full max-w-6xl mx-auto">
          <EditPostForm
            post={post}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      </div>
    </div>
  )
} 