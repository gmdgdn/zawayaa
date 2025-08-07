import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function TaqdeerLoading() {
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            {/* LongformLayout Skeleton */}
            <Card className="p-8">
              {/* Kicker */}
              <Skeleton className="h-5 w-32 mb-3" />
              
              {/* Title */}
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-3/4 mb-6" />
              
              {/* Deck */}
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3 mb-8" />
              
              {/* Featured Image */}
              <Skeleton className="h-64 w-full rounded-lg mb-8" />
              
              {/* Publication Info */}
              <div className="flex items-center space-x-4 space-x-reverse mb-8 pb-8 border-b border-gray-200">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </Card>

            {/* Charts Gallery Skeleton */}
            <Card className="p-8 mt-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-64 rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Methodology Skeleton */}
            <Card className="p-8 mt-8">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Verdict Card Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-6 w-16 mb-4" />
              <div className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-lg">
                <Skeleton className="w-5 h-5" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>

            {/* Publication Info Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Skeleton className="w-4 h-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Skeleton className="w-4 h-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Sources Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-6 w-16 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-2" />
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Share Skeleton */}
            <Card className="p-6">
              <Skeleton className="h-6 w-12 mb-4" />
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}