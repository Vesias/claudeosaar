import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "default" | "lg" | "xl" | "full"
}

export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6",
        {
          "max-w-screen-sm": size === "sm",
          "max-w-screen-lg": size === "default",
          "max-w-screen-xl": size === "lg",
          "max-w-screen-2xl": size === "xl",
          "max-w-none": size === "full",
        },
        className
      )}
    >
      {children}
    </div>
  )
}
