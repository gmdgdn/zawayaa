import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Home, Search } from 'lucide-react'

export default function EpisodeNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center p-12">
          {/* 404 Icon */}
          <div className="text-8xl mb-6">🎧</div>
          
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            الحلقة غير موجودة
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            عذراً، الحلقة التي تبحث عنها غير متاحة أو قد يكون تم حذفها.
          </p>

          {/* Suggestions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              يمكنك تجربة ما يلي:
            </h3>
            <ul className="text-gray-600 space-y-2 text-right">
              <li>• تأكد من صحة رابط الحلقة</li>
              <li>• ابحث عن الحلقة في البرنامج المناسب</li>
              <li>• تصفح البرامج الأخرى المتاحة</li>
              <li>• العودة إلى الصفحة الرئيسية</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/programs" className="flex items-center space-x-2 space-x-reverse">
                <Search className="w-4 h-4" />
                <span>تصفح البرامج</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center space-x-2 space-x-reverse">
                <Home className="w-4 h-4" />
                <span>الصفحة الرئيسية</span>
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              إذا كنت تعتقد أن هذا خطأ، يرجى{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">
                التواصل معنا
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}