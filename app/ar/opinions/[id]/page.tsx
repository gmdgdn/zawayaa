"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, ArrowRight, Heart, Share2, MessageCircle, Bookmark, FileText } from "lucide-react"
import Link from "next/link"

// Sample opinion articles data
const getOpinionById = (id: string) => {
  const opinions = {
    "po-001": {
      id: "po-001",
      title_ar: "ما بعد الريع: هل تكفي المشاريع العملاقة لبناء عقد اجتماعي جديد؟",
      author: {
        name: "سارة بلقاسمي",
        bio: "كاتبة وباحثة في السياسات العامة، متخصصة في قضايا التنمية الاقتصادية في الشرق الأوسط",
        avatar: "/placeholder-user.jpg",
        social_links: {
          twitter: "@sara_belqasemi",
          linkedin: "sara-belqasemi"
        }
      },
      summary_ar: "التحول الحقيقي ليس في الحجر، بل في البشر. مقال يحلل تحديات الانتقال من دولة الرفاه الريعي إلى دولة الإنتاجية والمواطنة.",
      published_date: "2025-01-20",
      read_time: 8,
      tags: ["اقتصاد", "تنمية", "دولة الرفاه", "سياسات عامة"],
      image_url: "/images/articles/post_rentier.png",
      content: `في عصر يشهد تحولات جذرية في بنية الاقتصاد العالمي، تقف الدول العربية النفطية أمام تحدٍ وجودي: كيف تنتقل من نموذج الدولة الريعية إلى دولة الإنتاجية والابتكار؟

هذا السؤال ليس مجرد استفهام اقتصادي، بل يمس جوهر العقد الاجتماعي الذي قام عليه الاستقرار السياسي في هذه المنطقة لعقود. فالمشاريع العملاقة التي تشهدها المنطقة اليوم - من نيوم إلى العاصمة الإدارية الجديدة - تطرح تساؤلات عميقة حول طبيعة التحول المطلوب.

## التحدي الحقيقي: تغيير الذهنية

المشكلة الأساسية لا تكمن في نقص الموارد المالية أو غياب الرؤية، بل في التحدي الثقافي والنفسي الذي يواجه مجتمعات اعتادت لعقود على دور الدولة الراعية. فالانتقال من ثقافة الاعتماد إلى ثقافة المبادرة يتطلب أكثر من مجرد استثمارات ضخمة في البنية التحتية.

إن نجاح هذا التحول يعتمد على قدرة هذه المجتمعات على إعادة تعريف علاقتها بالدولة والعمل والإنتاج. وهذا ما يتطلب استراتيجيات طويلة المدى تركز على التعليم وتطوير المهارات وخلق ثقافة ريادة الأعمال.

## المشاريع العملاقة: حل أم أعراض؟

بينما تبدو المشاريع الكبرى كحلول سحرية للتنويع الاقتصادي، فإن التجربة التاريخية تشير إلى أن النجاح الحقيقي يكمن في التفاصيل الصغيرة: تطوير التعليم، تعزيز ثقافة الريادة، وخلق بيئة تنظيمية محفزة للابتكار.

المشاريع العملاقة قد تكون ضرورية، لكنها ليست كافية. فالتحول الحقيقي يحدث في الفصول الدراسية والمختبرات الصغيرة والشركات الناشئة، وليس فقط في أبراج المدن الذكية.

## الطريق إلى الأمام

العبرة ليست في حجم المشاريع، بل في قدرتها على خلق دورة اقتصادية مستدامة تعتمد على الإنتاجية والابتكار بدلاً من الريع. وهذا يتطلب:

1. **استثماراً طويل الأمد في رأس المال البشري**: تطوير نظم تعليمية تركز على الإبداع والتفكير النقدي بدلاً من الحفظ والتلقين.

2. **إصلاح المؤسسات**: بناء مؤسسات شفافة وفعالة تدعم ريادة الأعمال والابتكار.

3. **تغيير الثقافة السياسية**: الانتقال من ثقافة الرعاية إلى ثقافة التمكين والمساءلة.

إن المشاريع العملاقة ليست سوى أدوات، والأهم من ذلك هو كيفية استخدامها لبناء مجتمعات منتجة ومبدعة. فالتحول الحقيقي ليس في الحجر، بل في البشر.`,
      views: 12500,
      likes: 890,
      comments: 45
    },
    "po-002": {
      id: "po-002",
      title_ar: "دبلوماسية المتاحف والملاعب: كيف تصنع 'القوة الناعمة' واقعًا سياسيًا؟",
      author: {
        name: "نور حداد",
        bio: "محللة سياسية متخصصة في العلاقات الدولية والدبلوماسية الثقافية",
        avatar: "/placeholder-user.jpg",
        social_links: {
          twitter: "@nour_haddad",
          linkedin: "nour-haddad"
        }
      },
      summary_ar: "استضافة الفعاليات الرياضية وبناء المتاحف أصبحا أدوات فعالة لإعادة رسم الصورة النمطية وتمرير رسائل سياسية.",
      published_date: "2025-01-18",
      read_time: 7,
      tags: ["دبلوماسية", "قوة ناعمة", "ثقافة", "رياضة"],
      image_url: "/images/articles/soft_power.png",
      content: `في عالم تتسارع فيه وتيرة التغيير الجيوسياسي، لم تعد القوة العسكرية والاقتصادية الأدوات الوحيدة للتأثير الدولي. فقد برزت "القوة الناعمة" كأحد أهم أدوات الدبلوماسية المعاصرة، وفي قلب هذا التوجه نجد استراتيجيات مبتكرة تتمحور حول الرياضة والثقافة.

## المتاحف كسفراء ثقافيين

تحولت المتاحف الحديثة من مجرد مستودعات للآثار إلى منصات دبلوماسية متطورة. متحف اللوفر أبوظبي، على سبيل المثال، ليس مجرد مؤسسة ثقافية، بل أداة لإعادة تموضع الإمارات كمركز ثقافي عالمي.

هذه المؤسسات تنجح في كسر الحواجز الثقافية وبناء جسور التفاهم بطريقة أكثر فعالية من المفاوضات الدبلوماسية التقليدية. فالزائر الذي يتأمل قطعة فنية في متحف قطري أو إماراتي يخرج بانطباع مختلف عن المنطقة من ذلك الذي تكونه نشرات الأخبار.

## الملاعب كمسارح سياسية

أما في عالم الرياضة، فقد أثبتت الأحداث الكبرى قدرتها على إعادة تشكيل الصورة النمطية للدول المضيفة. كأس العالم في قطر لم يكن مجرد بطولة رياضية، بل كان منصة لتقديم صورة جديدة عن الخليج العربي للعالم.

هذه الأحداث تخلق فرصاً فريدة للتفاعل المباشر مع الجماهير العالمية، وتوفر منصة لعرض الثقافة والضيافة العربية بشكل أصيل وجذاب.

## التحديات والفرص

لكن هذه الاستراتيجية لا تخلو من التحديات. فالقوة الناعمة تتطلب أصالة وصدقية، وأي محاولة للتلميع السطحي قد تأتي بنتائج عكسية. كما أن نجاحها يعتمد على التوازن بين التطلعات العالمية والهوية المحلية.

المطلوب اليوم هو استراتيجية شاملة تربط بين الاستثمار في البنية التحتية الثقافية والرياضية وبين تطوير المحتوى والقدرات المحلية. فالقوة الناعمة الحقيقية لا تُشترى، بل تُبنى عبر عقود من الاستثمار في التعليم والثقافة والإبداع.`,
      views: 9800,
      likes: 650,
      comments: 32
    }
  }
  
  return opinions[id as keyof typeof opinions] || null
}

export default function OpinionDetailPage() {
  const params = useParams()
  const opinion = getOpinionById(params.id as string)

  if (!opinion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
          <Link href="/ar/opinions">
            <Button>العودة إلى الآراء السياسية</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}ك`
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="content-container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-6">
          <Link href="/ar" className="hover:text-clr-accent">الرئيسية</Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/ar/opinions" className="hover:text-clr-accent">الآراء السياسية</Link>
          <ArrowRight className="w-4 h-4" />
          <span>المقال الحالي</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8 mb-8">
              {/* Category Badge */}
              <Badge className="badge badge-orange mb-4">
                <FileText className="w-4 h-4 ml-2" />
                رأي سياسي
              </Badge>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-ge-ss leading-tight">
                {opinion.title_ar}
              </h1>

              {/* Summary */}
              <div className="bg-clr-menthol/20 border-r-4 border-clr-menthol p-6 rounded-lg mb-8">
                <p className="text-lg text-gray-800 font-ge-ss leading-relaxed italic">
                  {opinion.summary_ar}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-start space-x-4 space-x-reverse bg-gray-100 p-6 rounded-lg mb-8">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={opinion.author.avatar} alt={opinion.author.name} />
                  <AvatarFallback>{opinion.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 font-ge-ss">{opinion.author.name}</h3>
                  <p className="text-gray-600 font-ge-ss leading-relaxed">{opinion.author.bio}</p>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Calendar className="w-4 h-4" />
                      <span className="font-ge-ss">{new Date(opinion.published_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Clock className="w-4 h-4" />
                      <span className="font-ge-ss">{opinion.read_time} دقائق قراءة</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Image */}
              {opinion.image_url && (
                <div className="mb-8">
                  <img 
                    src={opinion.image_url} 
                    alt={opinion.title_ar}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose-arabic reading-container">
                <div className="text-gray-800 font-ge-ss leading-reading whitespace-pre-line">
                  {opinion.content}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold font-ge-ss mb-4">علامات ذات صلة</h3>
                <div className="flex flex-wrap gap-2">
                  {opinion.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="badge border-gray-600 text-gray-600 font-ge-ss">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 space-x-reverse text-gray-600">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Heart className="w-5 h-5" />
                      <span className="font-ge-ss">{formatNumber(opinion.likes)} إعجاب</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-ge-ss">{opinion.comments} تعليق</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-ge-ss">{formatNumber(opinion.views)} قراءة</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 space-x-reverse">
                      <Heart className="w-4 h-4" />
                      <span>أعجبني</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 space-x-reverse">
                      <Share2 className="w-4 h-4" />
                      <span>مشاركة</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 space-x-reverse">
                      <Bookmark className="w-4 h-4" />
                      <span>حفظ</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">عن الكاتب</h3>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={opinion.author.avatar} alt={opinion.author.name} />
                    <AvatarFallback>{opinion.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold font-ge-ss">{opinion.author.name}</h4>
                    <p className="text-sm text-gray-600 font-ge-ss">{opinion.author.bio}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  عرض مقالات أخرى
                </Button>
              </div>
            </Card>

            {/* Related Articles */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">مقالات ذات صلة</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-bold font-ge-ss text-sm mb-2 hover:text-clr-accent cursor-pointer">
                      التحديات الاقتصادية في عالم ما بعد كوفيد
                    </h4>
                    <p className="text-xs text-gray-600 font-ge-ss">
                      تحليل للتحولات الاقتصادية الجديدة
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-bold font-ge-ss text-sm mb-2 hover:text-clr-accent cursor-pointer">
                      دور الشباب في التحول الديمقراطي
                    </h4>
                    <p className="text-xs text-gray-600 font-ge-ss">
                      رؤية معاصرة للمشاركة السياسية
                    </p>
                  </div>
                </div>
                <Link href="/ar/opinions">
                  <Button variant="outline" className="w-full">
                    عرض جميع الآراء السياسية
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Newsletter CTA */}
            <Card className="p-6 bg-gradient-to-br from-clr-primary-dark to-clr-iris text-white">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-ge-ss">اشترك في النشرة</h3>
                <p className="text-gray-100 font-ge-ss text-sm">
                  احصل على آخر المقالات والتحليلات السياسية
                </p>
                <Button variant="secondary" className="w-full">
                  اشترك الآن
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 