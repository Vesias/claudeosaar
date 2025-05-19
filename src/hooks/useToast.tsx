"use client"

import { useState, createContext, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastVariant = "default" | "success" | "destructive" | "info" | "warning"

export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  duration?: number
  action?: React.ReactNode
  onDismiss?: (id: string) => void
}

interface ToastContextValue {
  toasts: ToastProps[]
  toast: (toast: Omit<ToastProps, "id" | "onDismiss"> & Partial<Pick<ToastProps, "onDismiss">>) => string // Return toast id
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: Omit<ToastProps, "id" | "onDismiss"> & Partial<Pick<ToastProps, "onDismiss">>) => {
    const id = uuidv4()
    const newToast: ToastProps = { 
      id, 
      ...props,
      onDismiss: (toastId) => {
        if (props.onDismiss) {
          props.onDismiss(toastId);
        }
        dismiss(toastId);
      }
    }
    setToasts((prev) => [newToast, ...prev]) // Add new toasts to the beginning

    if (props.duration !== Infinity) {
      setTimeout(() => {
        newToast.onDismiss?.(id)
      }, props.duration || 5000)
    }
    return id;
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const context = useContext(ToastContext)
  if (!context) return null

  const { toasts } = context

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-3 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

const toastVariants = {
  default: "bg-background text-foreground border-border",
  success: "bg-green-600 text-white border-green-700",
  destructive: "bg-red-600 text-white border-red-700",
  info: "bg-blue-600 text-white border-blue-700",
  warning: "bg-yellow-500 text-black border-yellow-600",
}

export function Toast({ id, title, description, variant = "default", action, onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-lg transition-all flex items-start justify-between gap-3",
        toastVariants[variant]
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex-1 space-y-1">
        {title && <h3 className="font-semibold text-sm">{title}</h3>}
        {description && <p className="text-sm opacity-90">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      <button
        onClick={() => onDismiss?.(id)}
        className={cn(
          "p-1 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === "default" ? "hover:bg-muted focus:ring-ring" : "hover:bg-white/20 focus:ring-white"
        )}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}


export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
