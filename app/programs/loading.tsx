import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProgramsLoading() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Results Count Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>

        {/* Programs Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProgramCardSkeleton key={index} />
          ))}
        </div>

        {/* Newsletter CTA Skeleton */}
        <div className="mt-16 text-center">
          <Card className="p-8 max-w-2xl mx-auto">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto mb-6" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Skeleton className="h-12 flex-1 w-full sm:w-auto" />
              <Skeleton className="h-12 w-32" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProgramCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white">
      {/* Cover Image Skeleton */}
      <div className="relative h-64">
        <Skeleton className="w-full h-full" />
        {/* Type Icon Skeleton */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 flex-1 mr-4" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Host and Stats */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>

          <Skeleton className="h-3 w-32" />
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Card>
  )
}