import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Play, Eye } from "lucide-react"

// Sample situation assessment data based on the content guide
const situationAssessments = [
  {
    id: "sa-001",
    title_ar: "الخلافة الرقمية أم استئناف العقل؟ الذكاء الاصطناعي على مفترق طرق الحضارة العربية",
    summary_ar: "يقف العالم العربي اليوم أمام الذكاء الاصطناعي كما وقفت بغداد يومًا أمام حكمة الإغريق والفرس. فهل سيكون هذا الطوفان التكنولوجي أداة لفرض 'خلافة رقمية' من السيطرة والمراقبة، أم فرصة تاريخية لاستئناف مشروع العقل النقدي وبناء 'بيت حكمة' جديد؟",
    author: "د. أمين رشدي",
    published_date: "2025-07-25",
    read_time: 8,
    view_count: 12500,
    image_url: "/images/hero/ai_crossroads_hero.png",
    audio_url: "/audio/sa-001.mp3",
    tags: ["ذكاء اصطناعي", "تكنولوجيا", "حضارة عربية", "مستقبل"],
    featured: true
  },
  {
    id: "sa-002",
    title_ar: "جيوبوليتيك المياه: حروب الغد الصامتة على ضفاف النيل والفرات",
    summary_ar: "في منطقة يحددها الجفاف، لم يعد الصراع على المياه مجرد قضية بيئية، بل أصبح محورًا للسياسة الخارجية والأمن القومي. تحليل استراتيجي لمستقبل العلاقات بين دول المنبع والمصب.",
    author: "د. أيمن الصباغ",
    published_date: "2025-07-23",
    read_time: 10,
    view_count: 8900,
    image_url: "/images/articles/water_geopolitics.png",
    audio_url: "/audio/sa-002.mp3",
    tags: ["جيوبوليتيك", "الأمن المائي", "تركيا", "مصر", "إثيوبيا", "العراق"],
    featured: false
  },
  {
    id: "sa-003",
    title_ar: "الصين وإيران: تحالف الضرورة أم شراكة استراتيجية طويلة المدى؟",
    summary_ar: "تحليل لطبيعة العلاقات الصينية-الإيرانية في ظل العقوبات الأمريكية وتأثيرها على موازين القوى في الشرق الأوسط ومبادرة الحزام والطريق.",
    author: "د. ليلى محمود",
    published_date: "2025-07-20",
    read_time: 12,
    view_count: 6800,
    image_url: "/images/articles/china_iran.png",
    audio_url: "/audio/sa-003.mp3",
    tags: ["الصين", "إيران", "جيوسياسة", "الحزام والطريق"],
    featured: false
  },
  {
    id: "sa-004",
    title_ar: "مستقبل النظام المالي العالمي: هل ينتهي عصر الدولار؟",
    summary_ar: "مع صعود عملات رقمية جديدة وتزايد التعاملات بالعملات المحلية، يواجه النظام المالي العالمي تحديات جذرية قد تعيد تشكيل هيكل الاقتصاد الدولي.",
    author: "محمد الشرقاوي",
    published_date: "2025-07-18",
    read_time: 9,
    view_count: 5200,
    image_url: "/images/articles/global_finance.png",
    audio_url: "/audio/sa-004.mp3",
    tags: ["اقتصاد", "عملات رقمية", "الدولار", "نظام مالي"],
    featured: false
  }
]

export default function SituationAssessmentPage() {
  const featuredArticle = situationAssessments.find(article => article.featured)
  const otherArticles = situationAssessments.filter(article => !article.featured)

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ge-ss">تقدير موقف</h1>
          <p className="text-lg text-gray-600 font-ge-ss max-w-4xl">
            ركن تحليلي ضمن المنصة يُعنى بدراسة السياسة الدولية والصراعات المحتدمة، وتقديم تقديرات استراتيجية لمآلاتها. 
            يعتمد مقاربات علمية في تحليل توازنات القوى والتحولات الجيوسياسية، ويهدف إلى تقديم رؤى معمّقة تدعم فهم ديناميات الصراع وتطوراته.
          </p>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">المقال المميز</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="aspect-video md:aspect-square bg-gray-200 relative">
                    <img 
                      src={featuredArticle.image_url} 
                      alt={featuredArticle.title_ar}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-zawaya-accent text-white text-sm">
                      مميز
                    </Badge>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4 bg-zawaya-primary text-white">
                    تقدير موقف
                  </Badge>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-ge-ss">
                    {featuredArticle.title_ar}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 font-ge-ss leading-relaxed">
                    {featuredArticle.summary_ar}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-ge-ss">{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredArticle.published_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredArticle.read_time} دقائق</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{featuredArticle.view_count.toLocaleString('ar-SA')}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredArticle.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-ge-ss">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
                      asChild
                    >
                      <a href={`/ar/assessment/${featuredArticle.id}`}>
                        اقرأ التحليل كاملاً
                      </a>
                    </Button>
                    
                    {featuredArticle.audio_url && (
                      <Button 
                        variant="outline" 
                        className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
                      >
                        <Play className="w-4 h-4 ml-2" />
                        استمع للتحليل
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Other Articles Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">تحليلات أخرى</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Article Image */}
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={article.image_url} 
                    alt={article.title_ar}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-zawaya-primary text-white text-sm">
                    تقدير موقف
                  </Badge>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 font-ge-ss line-clamp-2">
                    {article.title_ar}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 font-ge-ss line-clamp-3 text-sm">
                    {article.summary_ar}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="font-ge-ss">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.read_time} دقائق</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.view_count.toLocaleString('ar-SA')}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-ge-ss">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss text-sm"
                      asChild
                    >
                      <a href={`/ar/assessment/${article.id}`}>
                        اقرأ التحليل
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
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
          >
            تحميل المزيد من التحليلات
          </Button>
        </div>
      </div>
    </div>
  )
} 