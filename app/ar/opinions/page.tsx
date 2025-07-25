import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Play } from "lucide-react"

// Sample data - will be replaced with database calls
const politicalOpinions = [
  {
    id: "po-001",
    title_ar: "ما بعد الريع: هل تكفي المشاريع العملاقة لبناء عقد اجتماعي جديد؟",
    summary_ar: "من 'نيوم' إلى 'العاصمة الإدارية'، تتسابق دول المنطقة في بناء مستقبل ما بعد النفط. لكن التحول الحقيقي ليس في الحجر، بل في البشر.",
    author: "سارة بلقاسمي",
    published_date: "2025-07-24",
    read_time: 6,
    image_url: "/images/articles/post_rentier.png",
    audio_url: "/audio/po-001.mp3",
    tags: ["اقتصاد", "سياسة", "تنمية"]
  },
  {
    id: "po-002", 
    title_ar: "دبلوماسية المتاحف والملاعب: كيف تصنع 'القوة الناعمة' واقعًا سياسيًا جديدًا؟",
    summary_ar: "لم تعد السياسة حكرًا على السفارات ووزارات الخارجية. استضافة الفعاليات الرياضية العالمية وبناء المتاحف الكبرى أصبحا أدوات فعالة لإعادة رسم الصورة النمطية.",
    author: "نور حداد",
    published_date: "2025-07-22",
    read_time: 7,
    image_url: "/images/articles/soft_power.png",
    audio_url: "/audio/po-002.mp3",
    tags: ["دبلوماسية", "قوة ناعمة", "ثقافة"]
  }
]

export default function PoliticalOpinionsPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ge-ss">آراء سياسية</h1>
          <p className="text-lg text-gray-600 font-ge-ss max-w-3xl">
            مساحة مخصصة للآراء الحرة في كل ما يخص السياسة، والاقتصاد، والمجتمع - جميع المقالات متوفرة بالصوت
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {politicalOpinions.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Article Image */}
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={article.image_url} 
                  alt={article.title_ar}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-zawaya-primary text-white">
                  آراء سياسية
                </Badge>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 font-ge-ss line-clamp-2">
                  {article.title_ar}
                </h2>
                
                <p className="text-gray-600 mb-4 font-ge-ss line-clamp-3">
                  {article.summary_ar}
                </p>

                {/* Article Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="font-ge-ss">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.published_date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.read_time} دقائق</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-ge-ss">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
                    asChild
                  >
                    <a href={`/ar/opinions/${article.id}`}>
                      اقرأ المقال
                    </a>
                  </Button>
                  
                  {article.audio_url && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
          >
            تحميل المزيد من المقالات
          </Button>
        </div>
      </div>
    </div>
  )
} 