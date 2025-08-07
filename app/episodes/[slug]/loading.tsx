import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function EpisodeLoading() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Episode Header Skeleton */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="mb-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-9 w-full mb-2" />
                <Skeleton className="h-9 w-3/4 mb-4" />
                <Skeleton className="h-5 w-48 mb-4" />
              </div>

              {/* Episode Meta Skeleton */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>

              {/* Episode Description Skeleton */}
              <div className="space-y-3 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Tags Skeleton */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            </div>

            {/* Episode Player Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-64 w-full rounded-lg" />
            </Card>

            {/* Transcript Skeleton */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Chapters Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-6 w-20 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-4 w-12 ml-3" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Points Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-2 space-x-reverse">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Resource Links Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-6 w-20 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}