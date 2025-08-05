import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Play, Video, Headphones, Star, Users } from "lucide-react"
import { fetchProgramsWithSCF } from "@/lib/program-scf-integration"
import { getProgramTypeDisplayName } from "@/lib/scf-mappings/program-mappings"
import Link from "next/link"
import Image from "next/image"

const typeIcons = {
  video: Video,
  audio: Headphones,
  mixed: Play
}

export default async function ProgramsPage() {
  // Fetch programs with complete SCF mapping
  let programsResult: Awaited<ReturnType<typeof fetchProgramsWithSCF>>

  try {
    programsResult = await fetchProgramsWithSCF({ perPage: 20 })
  } catch (error) {
    console.error('Failed to fetch programs:', error)
    // Fallback data
    programsResult = {
      programs: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0, hasNext: false, hasPrev: false },
      cacheTags: ['programs']
    }
  }

  const { programs, pagination } = programsResult

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ge-ss">البرامج</h1>
          <p className="text-lg text-gray-600 font-ge-ss max-w-4xl">
            مجموعة متنوعة من البرامج الصوتية والمرئية التي تغطي أهم القضايا المعاصرة بأسلوب تحليلي معمق
          </p>
        </div>

        {/* Program Type Filters */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 font-ge-ss">تصفح حسب النوع</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              الكل
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              مرئي
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              صوتي
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              مختلط
            </Button>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">جميع البرامج</h2>
          {programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => {
                const TypeIcon = typeIcons[program.type] || Play
                
                return (
                  <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <Image 
                        src={program.cover || '/images/placeholder-program.jpg'} 
                        alt={program.title}
                        fill
                        className="object-cover"
                      />
                      {program.themeColor && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                          style={{ 
                            background: `linear-gradient(to top, ${program.themeColor}40, transparent)` 
                          }}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant="secondary" 
                          className="text-white text-xs flex items-center gap-1"
                          style={{ backgroundColor: program.themeColor || '#6366f1' }}
                        >
                          <TypeIcon className="w-3 h-3" />
                          {getProgramTypeDisplayName(program.type)}
                        </Badge>
                        {program.rating && program.rating > 4 && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {program.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 font-ge-ss line-clamp-2">
                        <Link 
                          href={program.href}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {program.title}
                        </Link>
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{program.host}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{program.episodeCount} حلقة</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        {program.subscriberCount && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{program.subscriberCount.toLocaleString()} متابع</span>
                          </div>
                        )}
                        {program.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{program.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button asChild size="sm" className="w-full">
                        <Link href={program.href}>
                          عرض البرنامج
                        </Link>
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📻</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2 font-ge-ss">لا توجد برامج</h3>
              <p className="text-gray-500 font-ge-ss">لم نجد برامج متاحة حالياً</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-600">
                صفحة {pagination.currentPage} من {pagination.totalPages}
              </span>
            </div>
            {pagination.hasNext && (
              <Button variant="outline" size="lg">
                تحميل المزيد من البرامج
              </Button>
            )}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 font-ge-ss">لا تفوت أي حلقة جديدة</h3>
            <p className="text-lg mb-6 text-white/90 font-ge-ss">
              اشترك في نشرتنا البريدية للحصول على إشعارات بأحدث الحلقات والبرامج الجديدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-ge-ss text-right w-full sm:w-auto"
                dir="rtl"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-ge-ss w-full sm:w-auto">
                اشترك الآن
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}