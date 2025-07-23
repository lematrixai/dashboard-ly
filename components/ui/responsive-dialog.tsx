"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

// VisuallyHidden component for accessibility
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  showFooter?: boolean
  footerContent?: React.ReactNode
  fullScreen?: boolean
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
  showFooter = false,
  footerContent,
  fullScreen = false,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn(
          fullScreen ? "sm:max-w-[95vw] sm:max-h-[95vh]" : "sm:max-w-[425px]", 
          className
        )}>
          <DialogHeader>
            {title && (
              fullScreen ? (
                <VisuallyHidden>
                  <DialogTitle>{title}</DialogTitle>
                </VisuallyHidden>
              ) : (
                <DialogTitle>{title}</DialogTitle>
              )
            )}
            {description && !fullScreen && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className={cn(fullScreen ? "" : "space-y-4")}>
            {children}
          </div>
          {showFooter && footerContent && !fullScreen && (
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t">
              {footerContent}
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn(
        fullScreen ? "max-h-[100vh]" : "max-h-[90vh]", 
        className
      )}>
        {(title || description) && !fullScreen && (
          <DrawerHeader className="text-left">
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className={cn(
          fullScreen ? "" : "px-4 pb-4 overflow-y-auto"
        )}>
          {children}
        </div>
        {showFooter && footerContent && !fullScreen && (
          <DrawerFooter className="pt-2">
            {footerContent}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

// Legacy exports for backward compatibility
export const ResponsiveDialogTrigger = DialogTrigger
export const ResponsiveDialogPortal = DialogPortal
export const ResponsiveDialogOverlay = DialogOverlay
export const ResponsiveDialogContent = DialogContent
export const ResponsiveDialogHeader = DialogHeader
export const ResponsiveDialogFooter = DialogFooter
export const ResponsiveDialogTitle = DialogTitle
export const ResponsiveDialogDescription = DialogDescription 