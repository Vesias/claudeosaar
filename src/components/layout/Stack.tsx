import { cn } from '@/lib/utils'

interface StackProps {
  children: React.ReactNode
  className?: string
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
  direction?: "row" | "column"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around"
}

export function Stack({
  children,
  className,
  gap = "md",
  direction = "column",
  align = "stretch",
  justify = "start",
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        {
          "flex-row": direction === "row",
          "flex-col": direction === "column",
          "gap-0": gap === "none",
          "gap-1": gap === "xs", // Corresponds to 0.25rem / 4px
          "gap-2": gap === "sm", // Corresponds to 0.5rem / 8px
          "gap-4": gap === "md", // Corresponds to 1rem / 16px
          "gap-6": gap === "lg", // Corresponds to 1.5rem / 24px
          "gap-8": gap === "xl", // Corresponds to 2rem / 32px
          "items-start": align === "start",
          "items-center": align === "center",
          "items-end": align === "end",
          "items-stretch": align === "stretch",
          "justify-start": justify === "start",
          "justify-center": justify === "center",
          "justify-end": justify === "end",
          "justify-between": justify === "between",
          "justify-around": justify === "around",
        },
        className
      )}
    >
      {children}
    </div>
  )
}
