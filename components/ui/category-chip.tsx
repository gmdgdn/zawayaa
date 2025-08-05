"use client"

import { cn } from "@/lib/utils"

interface CategoryChipProps {
  category: string
  variant?: 'default' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

// Category color mapping following the design system
const getCategoryStyles = (category: string, variant: 'default' | 'filled' = 'default') => {
  const categoryMap: Record<string, { default: string; filled: string }> = {
    'آراء سياسية': {
      default: 'text-brand-red border-brand-red hover:bg-brand-red hover:text-white',
      filled: 'bg-brand-red text-white border-brand-red'
    },
    'تقدير موقف': {
      default: 'text-brand-green border-brand-green hover:bg-brand-green hover:text-white',
      filled: 'bg-brand-green text-white border-brand-green'
    },
    'ثقافة': {
      default: 'text-brand-violet border-brand-violet hover:bg-brand-violet hover:text-white',
      filled: 'bg-brand-violet text-white border-brand-violet'
    },
    'تاريخ': {
      default: 'text-brand-orange border-brand-orange hover:bg-brand-orange hover:text-white',
      filled: 'bg-brand-orange text-white border-brand-orange'
    },
    'تقنية': {
      default: 'text-brand-violet border-brand-violet hover:bg-brand-violet hover:text-white',
      filled: 'bg-brand-violet text-white border-brand-violet'
    },
    'وثائقيات': {
      default: 'text-brand-yellow border-brand-yellow hover:bg-brand-yellow hover:text-ink-900',
      filled: 'bg-brand-yellow text-ink-900 border-brand-yellow'
    },
    'بودكاست صوتي': {
      default: 'text-brand-mint border-brand-mint hover:bg-brand-mint hover:text-ink-900',
      filled: 'bg-brand-mint text-ink-900 border-brand-mint'
    },
    'بودكاست مرئي': {
      default: 'text-brand-orange border-brand-orange hover:bg-brand-orange hover:text-white',
      filled: 'bg-brand-orange text-white border-brand-orange'
    },
    'برامج': {
      default: 'text-brand-orange border-brand-orange hover:bg-brand-orange hover:text-white',
      filled: 'bg-brand-orange text-white border-brand-orange'
    },
    'فن': {
      default: 'text-brand-violet border-brand-violet hover:bg-brand-violet hover:text-white',
      filled: 'bg-brand-violet text-white border-brand-violet'
    },
  }
  
  return categoryMap[category]?.[variant] || 'text-ink-600 border-ink-600 hover:bg-ink-600 hover:text-white'
}

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  const sizeMap = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return sizeMap[size]
}

export function CategoryChip({
  category,
  variant = 'default',
  size = 'md',
  className = "",
  onClick
}: CategoryChipProps) {
  const Component = onClick ? 'button' : 'span'
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2",
        getCategoryStyles(category, variant),
        getSizeStyles(size),
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
    >
      {category}
    </Component>
  )
}