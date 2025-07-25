import HeroAssessment from "@/components/hero-assessment"
import MultimediaHub from "@/components/multimedia-hub"
import AnalysisTabs from "@/components/analysis-tabs"
import DocumentaryShowcase from "@/components/documentary-showcase"
import NewsletterSignUp from "@/components/newsletter-signup"

export default function HomePage() {
  // Sample data - In production, this would come from your CMS/API
  const heroData = {
    id: "assess-001",
    content_type: "article" as const,
    category_ar: "تقييم الوضع",
    title_ar: "ما بعد الريع: هل تكفي المشاريع العملاقة لبناء عقد اجتماعي جديد؟",
    author: "سارة بلقاسمي",
    published_date: "2025-01-20",
    summary_ar: "التحول الحقيقي ليس في الحجر، بل في البشر. مقال يحلل تحديات الانتقال من دولة الرفاه الريعي إلى دولة الإنتاجية والمواطنة.",
    image_url: "/images/articles/post_rentier.png"
  }

  const multimediaData = {
    title_ar: "أحدث إصداراتنا المرئية والصوتية",
    featured_episode: {
      id: "ep-001",
      program_name_ar: "شمال جنوب",
      title_ar: "الذكاء الاصطناعي والثقافة العربية: تحديات الهوية في العصر الرقمي",
      image_url: "/images/episodes/ai_culture.png",
      content_type: "video"
    },
    secondary_episodes: [
      {
        id: "ep-002",
        program_name_ar: "عبق التاريخ",
        title_ar: "الفن الإسلامي في العصر الحديث: بين الأصالة والمعاصرة",
        image_url: "/images/episodes/islamic_art.png",
        content_type: "audio"
      },
      {
        id: "ep-003",
        program_name_ar: "نقاش مفتوح",
        title_ar: "الجيوسياسة في الشرق الأوسط: قراءة في المتغيرات الإقليمية",
        image_url: "/images/episodes/geopolitics.png",
        content_type: "audio"
      }
    ]
  }

  const analysisData = {
    title_ar: "تحليلات وزوايا",
    opinions: [
      {
        id: "po-001",
        title_ar: "ما بعد الريع: هل تكفي المشاريع العملاقة لبناء عقد اجتماعي جديد؟",
        author: "سارة بلقاسمي",
        summary_ar: "التحول الحقيقي ليس في الحجر، بل في البشر. مقال يحلل تحديات الانتقال من دولة الرفاه الريعي إلى دولة الإنتاجية والمواطنة."
      },
      {
        id: "po-002",
        title_ar: "دبلوماسية المتاحف والملاعب: كيف تصنع 'القوة الناعمة' واقعًا سياسيًا؟",
        author: "نور حداد",
        summary_ar: "استضافة الفعاليات الرياضية وبناء المتاحف أصبحا أدوات فعالة لإعادة رسم الصورة النمطية وتمرير رسائل سياسية."
      },
      {
        id: "po-003",
        title_ar: "أزمة المياه في المنطقة: الجغرافيا السياسية للموارد المائية",
        author: "د. أحمد الزهراني",
        summary_ar: "المياه ستكون ساحة الصراع القادمة في المنطقة. تحليل للأبعاد الجيوسياسية لأزمة المياه وتأثيرها على الاستقرار الإقليمي."
      }
    ],
    articles: [
      {
        id: "art-001",
        title_ar: "ذاكرة على تذكرة سفر: جدل استعادة آثار الشرق من متاحف الغرب",
        author: "د. ريم الخوري",
        summary_ar: "هل هذه حماية للتراث الإنساني أم استمرار لسطوة استعمارية؟ مقال يغوص في الأبعاد القانونية والأخلاقية للجدل."
      },
      {
        id: "art-002",
        title_ar: "النهضة الثقافية في عصر الرقمنة: كيف تعيد التكنولوجيا تشكيل الإبداع العربي",
        author: "لينا السعود",
        summary_ar: "من المنصات الرقمية إلى الفن التفاعلي، استكشاف لكيفية تأثير التكنولوجيا على المشهد الثقافي العربي المعاصر."
      },
      {
        id: "art-003",
        title_ar: "طرق الحرير الجديدة: التجارة والثقافة في القرن الحادي والعشرين",
        author: "سامي النجار",
        summary_ar: "كيف تعيد المبادرات الاقتصادية الكبرى مثل طريق الحرير رسم خريطة التبادل الثقافي والحضاري في العالم."
      }
    ]
  }

  const documentaryData = [
    {
      id: "doc-001",
      program_ar: "زوايا الوثائقية",
      description_ar: "نروي الأحداث والأفكار والشخصيات من منظور تحليلي. كل وثائقي هنا محاولة لفهم ما حدث، ولماذا، وكيف يواصل تشكيل حاضرنا.",
      image_url: "/images/articles/soft_power.png",
      cta_link: "/ar/documentaries"
    },
    {
      id: "civ-001",
      program_ar: "حضارة الشرق",
      description_ar: "نعيد تقديم صورة الشرق كما عاشها أبناؤه: تعددٌ لا ينقلب إلى انقسام، واختلافٌ لم يكن بالضرورة صراعًا.",
      image_url: "/images/hero/ai_crossroads_hero.png",
      cta_link: "/ar/programs"
    }
  ]

  return (
    <main className="min-h-screen">
      <HeroAssessment data={heroData} />
      <MultimediaHub data={multimediaData} />
      <AnalysisTabs data={analysisData} />
      <DocumentaryShowcase data={documentaryData} />
      <NewsletterSignUp />
    </main>
  )
}
