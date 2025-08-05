export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Loading Overlay */}
      <div className="fixed inset-0 bg-slate-900 text-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">زوايا</h2>
          <p className="text-gray-300">جاري التحميل...</p>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-6 w-20 bg-white/20 rounded animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-8 w-3/4 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-white/20 rounded animate-pulse"></div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
              </div>
              
              <div className="flex space-x-4 space-x-reverse">
                <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
                <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}