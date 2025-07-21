"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Loader2,
  Plus,
  Trash2
} from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["Travel Guide", "Tips & Tricks", "Accommodation", "Safety", "Food", "Culture", "Adventure", "Luxury"]),
  status: z.enum(["draft", "published", "scheduled"]),
  scheduledDate: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

interface MediaFile {
  id: string
  file: File
  type: 'image' | 'video'
  preview: string
  uploadProgress: number
  uploaded: boolean
  url?: string
}

interface CreatePostFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const [loading, setLoading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "Travel Guide",
      status: "draft"
    }
  })

  const watchedStatus = watch("status")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      
      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a supported file type`)
        return
      }

      const fileId = Math.random().toString(36).substr(2, 9)
      const preview = URL.createObjectURL(file)
      
      const mediaFile: MediaFile = {
        id: fileId,
        file,
        type: isImage ? 'image' : 'video',
        preview,
        uploadProgress: 0,
        uploaded: false
      }

      setMediaFiles(prev => [...prev, mediaFile])
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const uploadMediaToCloudflare = async (file: File): Promise<string> => {
    // For now, we'll use Firebase Storage as a placeholder
    // In production, you'd upload to Cloudflare R2 or similar
    const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  }

  const uploadAllMedia = async (): Promise<string[]> => {
    if (mediaFiles.length === 0) return []

    setUploadingMedia(true)
    const uploadPromises = mediaFiles.map(async (mediaFile) => {
      try {
        const url = await uploadMediaToCloudflare(mediaFile.file)
        return url
      } catch (error) {
        console.error('Error uploading media:', error)
        throw new Error(`Failed to upload ${mediaFile.file.name}`)
      }
    })

    try {
      const urls = await Promise.all(uploadPromises)
      setUploadingMedia(false)
      return urls
    } catch (error) {
      setUploadingMedia(false)
      throw error
    }
  }

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      toast.error("You must be logged in to create a post")
      return
    }

    setLoading(true)
    try {
      // Upload all media files first
      const mediaUrls = await uploadAllMedia()

      // Create post document
      const postData = {
        title: data.title,
        content: data.content,
        category: data.category,
        status: data.status,
        scheduledDate: data.status === 'scheduled' ? data.scheduledDate : null,
        mediaUrls,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: data.status === 'published' ? serverTimestamp() : null
      }

      await addDoc(collection(db, 'posts'), postData)

      toast.success("Post created successfully!")
      onSuccess()
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter post title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            {...register("content")}
            placeholder="Write your post content..."
            rows={6}
            className={`${errors.content ? "border-red-500" : ""} resize-none`}
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Travel Guide">Travel Guide</SelectItem>
                <SelectItem value="Tips & Tricks">Tips & Tricks</SelectItem>
                <SelectItem value="Accommodation">Accommodation</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Culture">Culture</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={watchedStatus}
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {watchedStatus === 'scheduled' && (
          <div>
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              {...register("scheduledDate")}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Media Upload Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Label>Media Files</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingMedia}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Media
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {mediaFiles.map((mediaFile) => (
              <div key={mediaFile.id} className="relative group">
                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  {mediaFile.type === 'image' ? (
                    <img
                      src={mediaFile.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={mediaFile.preview}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                  
                  {/* File type indicator */}
                  <div className="absolute top-2 left-2">
                    {mediaFile.type === 'image' ? (
                      <ImageIcon className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                    ) : (
                      <Video className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                    )}
                  </div>

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeMediaFile(mediaFile.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* Upload progress */}
                  {mediaFile.uploadProgress > 0 && mediaFile.uploadProgress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      {mediaFile.uploadProgress}%
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {mediaFile.file.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {mediaFiles.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              No media files selected
            </p>
            <p className="text-xs text-gray-500">
              Click "Add Media" to upload images and videos
            </p>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading || uploadingMedia}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={loading || uploadingMedia}
        >
          {loading || uploadingMedia ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadingMedia ? "Uploading..." : "Creating..."}
            </>
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  )
} 