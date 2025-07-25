import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Play, Eye, BookOpen, Palette, Globe, History } from "lucide-react"

// Sample articles data based on the content guide
const articlesData = {
  "فن": [
    {
      id: "art-001",
      title_ar: "ذاكرة على تذكرة سفر: جدل استعادة آثار الشرق من متاحف الغرب",
      summary_ar: "من حجر رشيد إلى منحوتات تدمر، تستضيف متاحف الغرب ذاكرة الشرق. هل هذه حماية للتراث الإنساني أم استمرار لسطوة استعمارية؟ مقال يغوص في الأبعاد القانونية والأخلاقية والثقافية لأكبر جدل فني في عصرنا.",
      author: "د. ريم الخوري",
      published_date: "2025-07-20",
      read_time: 7,
      view_count: 4200,
      image_url: "/images/articles/restitution.png",
      audio_url: "/audio/art-001.mp3",
      tags: ["فن", "تراث", "ثقافة", "متاحف"]
    },
    {
      id: "art-002",
      title_ar: "الفن الرقمي والهوية العربية: بين التقليد والحداثة",
      summary_ar: "كيف يواجه الفنانون العرب تحديات العصر الرقمي؟ وما هو دور التكنولوجيا في إعادة تشكيل التعبير الفني العربي المعاصر؟",
      author: "سليم النجار",
      published_date: "2025-07-18",
      read_time: 6,
      view_count: 3800,
      image_url: "/images/articles/digital_art.png",
      audio_url: "/audio/art-002.mp3",
      tags: ["فن رقمي", "هوية", "حداثة", "تكنولوجيا"]
    }
  ],
  "أدب": [
    {
      id: "lit-001",
      title_ar: "الرواية العربية المعاصرة: أصوات جديدة وأساليب مبتكرة",
      summary_ar: "استعراض لأبرز الأعمال الروائية العربية الحديثة وتحليل للتطورات الأسلوبية والموضوعية التي تميز الجيل الجديد من الكتاب.",
      author: "أحمد سليمان",
      published_date: "2025-07-19",
      read_time: 8,
      view_count: 5100,
      image_url: "/images/articles/contemporary_novel.png",
      audio_url: "/audio/lit-001.mp3",
      tags: ["أدب", "رواية", "كتابة", "معاصر"]
    },
    {
      id: "lit-002",
      title_ar: "الشعر في العصر الرقمي: منصات جديدة وجماهير مختلفة",
      summary_ar: "كيف أثرت وسائل التواصل الاجتماعي على كتابة الشعر ونشره؟ وما هي التحديات والفرص التي يواجهها الشعراء اليوم؟",
      author: "نور الهدى محمد",
      published_date: "2025-07-16",
      read_time: 5,
      view_count: 2900,
      image_url: "/images/articles/digital_poetry.png",
      audio_url: "/audio/lit-002.mp3",
      tags: ["شعر", "رقمي", "وسائل التواصل", "أدب"]
    }
  ],
  "ثقافة": [
    {
      id: "cul-001",
      title_ar: "النهضة الثقافية العربية في القرن الحادي والعشرين",
      summary_ar: "نظرة على الحركة الثقافية المعاصرة في العالم العربي وتأثيرها على الهوية، من خلال استعراض أبرز المبادرات والمشاريع الثقافية الرائدة.",
      author: "د. عائشة الكندي",
      published_date: "2025-07-21",
      read_time: 9,
      view_count: 6500,
      image_url: "/images/articles/cultural_renaissance.png",
      audio_url: "/audio/cul-001.mp3",
      tags: ["ثقافة", "نهضة", "هوية", "معاصر"]
    },
    {
      id: "cul-002",
      title_ar: "الثقافة الشعبية والعولمة: تحديات الحفاظ على التراث",
      summary_ar: "دراسة لتأثير العولمة على الثقافات المحلية والجهود المبذولة للحفاظ على التراث الشعبي في مواجهة التيارات الثقافية العالمية.",
      author: "محمد الزهراني",
      published_date: "2025-07-17",
      read_time: 7,
      view_count: 4700,
      image_url: "/images/articles/folk_culture.png",
      audio_url: "/audio/cul-002.mp3",
      tags: ["تراث", "عولمة", "ثقافة شعبية", "هوية"]
    }
  ],
  "تاريخ": [
    {
      id: "hist-001",
      title_ar: "ما وراء السيف والصليب: قراءة في التجارة والأفكار المنسية زمن الحروب الصليبية",
      summary_ar: "بعيدًا عن سردية الصراع الحضاري، يكشف هذا المقال عن شبكات التجارة والتبادل المعرفي التي ازدهرت بين الشرق والغرب في خضم الحروب الصليبية، وكيف شكلت هذه التفاعلات المنسية جزءًا من تاريخ المنطقتين.",
      author: "حسن الإدريسي",
      published_date: "2025-07-19",
      read_time: 10,
      view_count: 7200,
      image_url: "/images/articles/crusades_trade.png",
      audio_url: "/audio/hist-001.mp3",
      tags: ["تاريخ", "حروب صليبية", "تجارة", "تبادل ثقافي"]
    },
    {
      id: "hist-002",
      title_ar: "بيت الحكمة: دروس من التاريخ للمستقبل العربي",
      summary_ar: "استعراض لتجربة بيت الحكمة في بغداد وكيف يمكن الاستفادة من هذا النموذج التاريخي في بناء مراكز معرفية معاصرة.",
      author: "د. علي الصفار",
      published_date: "2025-07-15",
      read_time: 8,
      view_count: 5800,
      image_url: "/images/articles/house_of_wisdom.png",
      audio_url: "/audio/hist-002.mp3",
      tags: ["تاريخ إسلامي", "بيت الحكمة", "معرفة", "بغداد"]
    }
  ]
}

const categoryIcons = {
  "فن": Palette,
  "أدب": BookOpen,
  "ثقافة": Globe,
  "تاريخ": History
}

const categoryColors = {
  "فن": "bg-purple-100 text-purple-800",
  "أدب": "bg-blue-100 text-blue-800",
  "ثقافة": "bg-green-100 text-green-800",
  "تاريخ": "bg-orange-100 text-orange-800"
}

export default function ArticlesPage() {
  const allArticles = Object.values(articlesData).flat()
  const featuredArticle = allArticles.find(article => article.view_count > 6000)

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ge-ss">مقالات</h1>
          <p className="text-lg text-gray-600 font-ge-ss max-w-4xl">
            مقالات متنوعة في كل ما يخص الأدب، والثقافة، والتاريخ الإنساني العالمي - جميع المقالات متوفرة بالصوت
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
                    مقالات
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
                      <a href={`/ar/articles/${featuredArticle.id}`}>
                        اقرأ المقال كاملاً
                      </a>
                    </Button>
                    
                    {featuredArticle.audio_url && (
                      <Button 
                        variant="outline" 
                        className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
                      >
                        <Play className="w-4 h-4 ml-2" />
                        استمع للمقال
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Articles by Category */}
        <Tabs defaultValue="الكل" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="الكل" className="font-ge-ss">الكل</TabsTrigger>
            <TabsTrigger value="فن" className="font-ge-ss">فن</TabsTrigger>
            <TabsTrigger value="أدب" className="font-ge-ss">أدب</TabsTrigger>
            <TabsTrigger value="ثقافة" className="font-ge-ss">ثقافة</TabsTrigger>
            <TabsTrigger value="تاريخ" className="font-ge-ss">تاريخ</TabsTrigger>
          </TabsList>

          <TabsContent value="الكل">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allArticles.filter(article => article.id !== featuredArticle?.id).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>

          {Object.entries(articlesData).map(([category, articles]) => (
            <TabsContent key={category} value={category}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-ge-ss flex items-center gap-2">
                  {(() => {
                    const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
                    return <IconComponent className="w-5 h-5" />
                  })()}
                  {category}
                </h3>
                <p className="text-gray-600 font-ge-ss">
                  {category === "فن" && "مقالات عن الفنون البصرية والتشكيلية والفن المعاصر"}
                  {category === "أدب" && "مقالات عن الأدب العربي والعالمي والنقد الأدبي"}
                  {category === "ثقافة" && "مقالات عن الثقافة والمجتمع والهوية الثقافية"}
                  {category === "تاريخ" && "مقالات عن التاريخ العربي والإسلامي والعالمي"}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} category={category} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

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

function ArticleCard({ article, category }: { article: any, category?: string }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Article Image */}
      <div className="aspect-video bg-gray-200 relative">
        <img 
          src={article.image_url} 
          alt={article.title_ar}
          className="w-full h-full object-cover"
        />
        {category && (
          <Badge className={`absolute top-3 right-3 text-sm ${categoryColors[category as keyof typeof categoryColors]}`}>
            {category}
          </Badge>
        )}
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
          {article.tags.slice(0, 3).map((tag: string) => (
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
            <a href={`/ar/articles/${article.id}`}>
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
  )
} 