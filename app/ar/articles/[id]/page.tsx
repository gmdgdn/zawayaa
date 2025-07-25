"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, Heart, Share2 } from "lucide-react"
import Link from "next/link"

// This would normally come from your API/database
const getArticleById = (id: string) => {
  const articles = {
    "po-001": {
      id: "po-001",
      title_ar: "ما بعد الريع: هل تكفي المشاريع العملاقة لبناء عقد اجتماعي جديد؟",
      author: "سارة بلقاسمي",
      summary_ar: "التحول الحقيقي ليس في الحجر، بل في البشر. مقال يحلل تحديات الانتقال من دولة الرفاه الريعي إلى دولة الإنتاجية والمواطنة.",
      content: `في عصر يشهد تحولات جذرية في بنية الاقتصاد العالمي، تقف الدول العربية النفطية أمام تحدٍ وجودي: كيف تنتقل من نموذج الدولة الريعية إلى دولة الإنتاجية والابتكار؟

      هذا السؤال ليس مجرد استفهام اقتصادي، بل يمس جوهر العقد الاجتماعي الذي قام عليه الاستقرار السياسي في هذه المنطقة لعقود. فالمشاريع العملاقة التي تشهدها المنطقة اليوم - من نيوم إلى العاصمة الإدارية الجديدة - تطرح تساؤلات عميقة حول طبيعة التحول المطلوب.

      ## التحدي الحقيقي: تغيير الذهنية

      المشكلة الأساسية لا تكمن في نقص الموارد المالية أو غياب الرؤية، بل في التحدي الثقافي والنفسي الذي يواجه مجتمعات اعتادت لعقود على دور الدولة الراعية. فالانتقال من ثقافة الاعتماد إلى ثقافة المبادرة يتطلب أكثر من مجرد استثمارات ضخمة في البنية التحتية.

      ## المشاريع العملاقة: حل أم أعراض؟

      بينما تبدو المشاريع الكبرى كحلول سحرية للتنويع الاقتصادي، فإن التجربة التاريخية تشير إلى أن النجاح الحقيقي يكمن في التفاصيل الصغيرة: تطوير التعليم، تعزيز ثقافة الريادة، وخلق بيئة تنظيمية محفزة للابتكار.

      ## الطريق إلى الأمام

      العبرة ليست في حجم المشاريع، بل في قدرتها على خلق دورة اقتصادية مستدامة تعتمد على الإنتاجية والابتكار بدلاً من الريع. وهذا يتطلب استثماراً طويل الأمد في رأس المال البشري والمؤسسي.`,
      category_ar: "آراء سياسية",
      published_date: "2025-01-20",
      read_time: 8,
      image_url: "/images/articles/post_rentier.png"
    },
    "po-002": {
      id: "po-002", 
      title_ar: "دبلوماسية المتاحف والملاعب: كيف تصنع 'القوة الناعمة' واقعًا سياسيًا؟",
      author: "نور حداد",
      summary_ar: "استضافة الفعاليات الرياضية وبناء المتاحف أصبحا أدوات فعالة لإعادة رسم الصورة النمطية وتمرير رسائل سياسية.",
      content: `في عالم تتسارع فيه وتيرة التغيير الجيوسياسي، لم تعد القوة العسكرية والاقتصادية الأدوات الوحيدة للتأثير الدولي. فقد برزت "القوة الناعمة" كأحد أهم أدوات الدبلوماسية المعاصرة، وفي قلب هذا التوجه نجد استراتيجيات مبتكرة تتمحور حول الرياضة والثقافة.`,
      category_ar: "آراء سياسية", 
      published_date: "2025-01-18",
      read_time: 7,
      image_url: "/images/articles/soft_power.png"
    },
    "art-001": {
      id: "art-001",
      title_ar: "ذاكرة على تذكرة سفر: جدل استعادة آثار الشرق من متاحف الغرب",
      author: "د. ريم الخوري", 
      summary_ar: "هل هذه حماية للتراث الإنساني أم استمرار لسطوة استعمارية؟ مقال يغوص في الأبعاد القانونية والأخلاقية للجدل.",
      content: `من حجر رشيد في المتحف البريطاني إلى تمثال نفرتيتي في برلين، تحتضن المتاحف الغربية الكبرى كنوزاً أثرية لا تقدر بثمن من حضارات الشرق. لكن هذا الاحتضان، الذي استمر لأكثر من قرنين، يواجه اليوم تحدياً متزايداً من دول المنشأ التي تطالب باستعادة تراثها المنهوب.`,
      category_ar: "مقالات",
      published_date: "2025-01-15",
      read_time: 12,
      image_url: "/images/articles/restitution.png"
    }
  }
  
  return articles[id as keyof typeof articles] || null
}

export default function ArticleDetailPage() {
  const params = useParams()
  const article = getArticleById(params.id as string)

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
          <Link href="/ar/articles">
            <Button>العودة إلى المقالات</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="content-container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-6">
          <Link href="/ar" className="hover:text-clr-accent">الرئيسية</Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/ar/articles" className="hover:text-clr-accent">المقالات</Link>
          <ArrowRight className="w-4 h-4" />
          <span>المقال الحالي</span>
        </div>

        {/* Article Content */}
        <Card className="p-8 mb-8">
          {/* Category Badge */}
          <Badge className="badge badge-iris mb-4">
            {article.category_ar}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-ge-ss leading-tight">
            {article.title_ar}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <User className="w-5 h-5" />
              <span className="font-ge-ss">{article.author}</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Calendar className="w-5 h-5" />
              <span className="font-ge-ss">{new Date(article.published_date).toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-5 h-5" />
              <span className="font-ge-ss">{article.read_time} دقائق قراءة</span>
            </div>
          </div>

          {/* Article Image */}
          {article.image_url && (
            <div className="mb-8">
              <img 
                src={article.image_url} 
                alt={article.title_ar}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Summary */}
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <p className="text-lg text-gray-800 font-ge-ss leading-relaxed">
              {article.summary_ar}
            </p>
          </div>

          {/* Article Content */}
          <div className="prose-arabic reading-container">
            <div className="text-gray-800 font-ge-ss leading-reading whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Article Actions */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
                <Heart className="w-5 h-5" />
                <span>أعجبني</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
                <Share2 className="w-5 h-5" />
                <span>مشاركة</span>
              </Button>
            </div>
            <Link href="/ar/articles">
              <Button>العودة إلى المقالات</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
} 