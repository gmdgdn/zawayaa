import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
  showKuficBand?: boolean
  showIrisStripe?: boolean
}

export function SectionHeader({ 
  title, 
  subtitle, 
  className = "",
  showKuficBand = false,
  showIrisStripe = true
}: SectionHeaderProps) {
  return (
    <header className={cn("relative py-8", className)}>
      {/* Angle grid pattern behind title */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="section-angle-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <g fill="currentColor">
                <polygon points="20,2 35,17 20,32 5,17" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#section-angle-grid)" />
        </svg>
      </div>
      
      {/* Main Title */}
      <h2 className="relative text-3xl lg:text-4xl font-bold text-ink-700 mb-2 font-ge-ss">
        {title}
      </h2>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="relative text-ink-600 text-lg mb-4">
          {subtitle}
        </p>
      )}
      
      {/* Iris Signal Stripe */}
      {showIrisStripe && (
        <div className="relative h-1 mt-3 bg-gradient-to-r from-brand-violet to-brand-mint opacity-20 rounded-full"></div>
      )}
    </header>
  )
}