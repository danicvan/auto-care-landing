"use client"

import * as React from "react"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  duration?: number
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement

export function Toaster() {
  return (
    <ToastProvider swipeDirection="right">
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-2 p-4 w-96 z-50" />
    </ToastProvider>
  )
}

export const ToastItem = React.forwardRef<
  React.ElementRef<typeof Toast>,
  React.ComponentPropsWithoutRef<typeof Toast>
>(({ className, ...props }, ref) => (
  <Toast
    ref={ref}
    className={cn(
      "bg-white border border-gray-200 rounded-md shadow-lg p-4",
      className
    )}
    {...props}
  />
))
ToastItem.displayName = "ToastItem"

export {
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
}
