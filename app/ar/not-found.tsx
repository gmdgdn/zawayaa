import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"
import { MashrabiyaAngleGrid } from "@/components/ui/background-patterns"
import { SearchBar } from "@/components/ui/search-bar"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center relative overflow-hidden">
      <MashrabiyaAngleGrid className="text-stone-300" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* 404 Number with Arabic styling */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary/20 font-ge-ss leading-none">
              404
            </div>
            <div className="text-6xl font-bold text-primary/10 font-ge-ss -mt-4">
              ٤٠٤
            </div>
          </div>
          
          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-h1-mobile lg:text-h1-desktop font-ge-ss text-ink-900 mb-4">
              الصفحة غير موجودة
            </h1>
            <p className="text-lead text-ink-600 mb-6 max-w-lg mx-auto">
              عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <SearchBar 
              placeholder="ابحث عن المحتوى الذي تريده..."
              className="w-full"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white hover-lift">
              <Link href="/ar">
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white hover-lift">
              <Link href="/ar/articles">
                المقالات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </Button>
          </div>
          
          {/* Helpful Links */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h3 className="text-h3-mobile font-ge-ss text-ink-900 mb-4">
              ربما تبحث عن:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 text-right">
              <div className="space-y-2">
                <h4 className="font-bold text-ink-700 text-sm">المحتوى المكتوب</h4>
                <ul className="space-y-1 text-sm text-ink-600">
                  <li>
                    <Link href="/ar/articles" className="hover:text-primary transition-colors">
                      جميع المقالات
                    </Link>
                  </li>
                  <li>
                    <Link href="/ar/articles?category=politics" className="hover:text-primary transition-colors">
                      آراء سياسية
                    </Link>
                  </li>
                  <li>
                    <Link href="/ar/articles?category=analysis" className="hover:text-primary transition-colors">
                      تقدير موقف
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-ink-700 text-sm">المحتوى المرئي والصوتي</h4>
                <ul className="space-y-1 text-sm text-ink-600">
                  <li>
                    <Link href="/ar/programs" className="hover:text-primary transition-colors">
                      البرامج
                    </Link>
                  </li>
                  <li>
                    <Link href="/ar/podcast" className="hover:text-primary transition-colors">
                      البودكاست
                    </Link>
                  </li>
                  <li>
                    <Link href="/ar/documentaries" className="hover:text-primary transition-colors">
                      الوثائقيات
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}