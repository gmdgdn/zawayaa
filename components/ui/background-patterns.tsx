// Zawaya Background Patterns - Geometric Arabic-inspired designs

export const MashrabiyaAngleGrid = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 opacity-[0.04] ${className}`}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="mashrabiya" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <polygon points="30,5 50,25 30,45 10,25" />
            <polygon points="5,30 25,50 45,30 25,10" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mashrabiya)" />
    </svg>
  </div>
)

export const KuficBand = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-2 opacity-10 ${className}`}>
    <svg width="100%" height="8" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="kufic" x="0" y="0" width="40" height="8" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <rect x="0" y="0" width="8" height="8" />
            <rect x="16" y="0" width="8" height="8" />
            <rect x="32" y="0" width="8" height="8" />
            <rect x="8" y="2" width="8" height="4" />
            <rect x="24" y="2" width="8" height="4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kufic)" />
    </svg>
  </div>
)

export const TriTessellation = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 opacity-[0.06] ${className}`}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="triangles" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <polygon points="20,10 30,30 10,30" />
            <polygon points="60,20 70,40 50,40" />
            <polygon points="40,50 50,70 30,70" />
            <polygon points="70,60 80,80 60,80" />
            <polygon points="10,70 20,90 0,90" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#triangles)" />
    </svg>
  </div>
)

export const MuqarnasDots = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-8 opacity-8 ${className}`}>
    <svg width="100%" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="muqarnas" x="0" y="0" width="24" height="32" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <circle cx="4" cy="8" r="1" />
            <circle cx="12" cy="4" r="1" />
            <circle cx="20" cy="8" r="1" />
            <circle cx="8" cy="16" r="1" />
            <circle cx="16" cy="12" r="1" />
            <circle cx="4" cy="24" r="1" />
            <circle cx="20" cy="24" r="1" />
            <circle cx="12" cy="28" r="1" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#muqarnas)" />
    </svg>
  </div>
)