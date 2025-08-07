import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-2xl px-md py-xs text--1 font-medium ring-1 ring-inset transition-colors focus:outline-none focus:ring-2 focus:ring-accent-600",
  {
    variants: {
      variant: {
        category: "bg-accent-300/20 text-primary-900 ring-accent-600/30 hover:bg-accent-300/30",
        tag: "bg-primary-900/10 text-primary-700 ring-primary-900/20 hover:bg-primary-900/20",
        verdict: "bg-accent-600 text-neutral-50 ring-accent-600 hover:bg-accent-600/90",
        success: "bg-green-100 text-green-800 ring-green-600/20",
        warning: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
        error: "bg-red-100 text-red-800 ring-red-600/20",
      },
    },
    defaultVariants: {
      variant: "category",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
