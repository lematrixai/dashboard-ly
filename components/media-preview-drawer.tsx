"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"

interface MediaPreviewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mediaUrl: string
  mediaType: 'image' | 'video'
  fileName?: string
}

export function MediaPreviewDrawer({
  open,
  onOpenChange,
  mediaUrl,
  mediaType,
  fileName = 'Media File'
}: MediaPreviewDrawerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (mediaType === 'video' && videoRef.current && open) {
      videoRef.current.play()
    }
  }, [mediaType, open])

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={fileName}
      fullScreen={true}
    >
      <div className="relative bg-black rounded-lg overflow-hidden">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Media content */}
        {mediaType === 'image' ? (
          <img
            src={mediaUrl}
            alt={fileName}
            className="w-full h-full max-h-[80vh] object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="w-full h-full max-h-[80vh] object-contain"
            controls
            autoPlay
            muted
          />
        )}
      </div>
    </ResponsiveDialog>
  )
} 