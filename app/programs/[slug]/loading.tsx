import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProgramLoading() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Program Hero Skeleton */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        {/* Content Overlay Skeleton */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="absolute bottom-0 p-6 md:p-8 lg:p-12 w-full">
            <div className="max-w-4xl">
              {/* Program Type Badge Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Program Title Skeleton */}
              <Skeleton className="h-12 w-96 mb-4" />

              {/* Host Name Skeleton */}
              <Skeleton className="h-6 w-48 mb-6" />

              {/* Program Stats Skeleton */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Program Description Skeleton */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Episodes Section Skeleton */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>

          {/* Episodes Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <EpisodeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EpisodeCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white">
      {/* Episode Thumbnail Skeleton */}
      <div className="relative h-48">
        <Skeleton className="w-full h-full" />
        
        {/* Episode Number Badge Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-12 rounded" />
        </div>

        {/* Media Type Icon Skeleton */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>

        {/* Duration Skeleton */}
        <div className="absolute bottom-3 right-3">
          <Skeleton className="h-6 w-12 rounded" />
        </div>
      </div>

      {/* Episode Content Skeleton */}
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </Card>
  )
}