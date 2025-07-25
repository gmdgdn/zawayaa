import HeroSection from "@/components/hero-section"
import NewsletterSignup from "@/components/newsletter-signup"
import type { HomepageContent } from "@/lib/types"

// Sample data based on the content guide - will be replaced with database calls
const sampleHomepageData: HomepageContent = {
  hero_featured_article: {
    id: "sa-001",
    slug: "digital-caliphate-or-renewed-mind",
    title_ar: "الخلافة الرقمية أم استئناف العقل؟ الذكاء الاصطناعي على مفترق طرق الحضارة العربية",
    category_ar: "تقدير موقف",
    summary_ar: "يقف العالم العربي اليوم أمام الذكاء الاصطناعي كما وقفت بغداد يومًا أمام حكمة الإغريق والفرس. فهل سيكون هذا الطوفان التكنولوجي أداة لفرض 'خلافة رقمية' من السيطرة والمراقبة، أم فرصة تاريخية لاستئناف مشروع العقل النقدي وبناء 'بيت حكمة' جديد؟",
    content: "",
    author: {
      id: "auth-001",
      name: "د. أمين رشدي",
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    },
    category: {
      id: "cat-001",
      name_ar: "تقدير موقف",
      slug: "situation-assessment",
      is_active: true
    },
    published_date: "2025-07-25",
    image_url: "/images/hero/ai_crossroads_hero.png",
    audio_url: "/audio/sa-001.mp3",
    tags_ar: ["ذكاء اصطناعي", "تكنولوجيا", "حضارة عربية"],
    is_featured: true,
    view_count: 0,
    like_count: 0,
    read_time_minutes: 8,
    status: "published",
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },

  latest_podcasts_and_programs: [
    {
      id: "ns-002",
      title_ar: "إفريقيا: كيف أصبحت ساحة التنافس الجديدة للقوى الإقليمية؟",
      guest_ar: "د. فاطمة عبد السلام",
      host_ar: "خالد المصري",
      published_date: "2025-07-24",
      summary_ar: "تحليل معمّق لكيفية تحول إفريقيا من قارة على الهامش إلى مركز التنافس الجيوسياسي بين قوى الشرق الأوسط، الصين، وأوروبا.",
      duration: "45:15",
      episode_number: 2,
      season_number: 1,
      video_url: "/video/podcasts/ns-002.mp4",
      audio_url: "/audio/podcasts/ns-002.mp3",
      view_count: 0,
      like_count: 0,
      download_count: 0,
      status: "published",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
      program: {
        id: "prog-ns",
        slug: "north-south",
        type: "video",
        title_ar: "شمال جنوب",
        description_ar: "مساحة حوارية شهرية تستضيف شخصيات بحثية وسياسية من مختلف أنحاء العالم",
        featured: true,
        episode_count: 2,
        duration_avg: 45,
        view_count: 0,
        subscriber_count: 0,
        status: "active",
        created_at: "2025-01-01",
        updated_at: "2025-01-01"
      }
    }
  ],

  opinions_and_assessments: [
    {
      id: "po-001",
      slug: "post-rentier-social-contract",
      title_ar: "ما بعد الريع: هل تكفي المشاريع العملاقة لبناء عقد اجتماعي جديد؟",
      category_ar: "آراء سياسية",
      summary_ar: "من 'نيوم' إلى 'العاصمة الإدارية'، تتسابق دول المنطقة في بناء مستقبل ما بعد النفط. لكن التحول الحقيقي ليس في الحجر، بل في البشر.",
      content: "",
      author: {
        id: "auth-002",
        name: "سارة بلقاسمي",
        created_at: "2025-01-01",
        updated_at: "2025-01-01"
      },
      category: {
        id: "cat-002",
        name_ar: "آراء سياسية",
        slug: "political-opinions",
        is_active: true
      },
      published_date: "2025-07-24",
      image_url: "/images/articles/post_rentier.png",
      audio_url: "/audio/po-001.mp3",
      tags_ar: ["اقتصاد", "سياسة", "تنمية"],
      is_featured: false,
      view_count: 0,
      like_count: 0,
      read_time_minutes: 6,
      status: "published",
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    },
    {
      id: "sa-002",
      slug: "water-geopolitics",
      title_ar: "جيوبوليتيك المياه: حروب الغد الصامتة على ضفاف النيل والفرات",
      category_ar: "تقدير موقف",
      summary_ar: "في منطقة يحددها الجفاف، لم يعد الصراع على المياه مجرد قضية بيئية، بل أصبح محورًا للسياسة الخارجية والأمن القومي.",
      content: "",
      author: {
        id: "auth-004",
        name: "د. أيمن الصباغ",
        created_at: "2025-01-01",
        updated_at: "2025-01-01"
      },
      category: {
        id: "cat-001",
        name_ar: "تقدير موقف",
        slug: "situation-assessment",
        is_active: true
      },
      published_date: "2025-07-23",
      image_url: "/images/articles/water_geopolitics.png",
      audio_url: "/audio/sa-002.mp3",
      tags_ar: ["جيوبوليتيك", "مياه", "أمن قومي"],
      is_featured: false,
      view_count: 0,
      like_count: 0,
      read_time_minutes: 8,
      status: "published",
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    }
  ],

  diverse_articles: [
    {
      id: "art-001",
      slug: "artifacts-restitution-debate",
      title_ar: "ذاكرة على تذكرة سفر: جدل استعادة آثار الشرق من متاحف الغرب",
      category_ar: "مقالات",
      subcategory_ar: "فن",
      summary_ar: "من حجر رشيد إلى منحوتات تدمر، تستضيف متاحف الغرب ذاكرة الشرق. هل هذه حماية للتراث الإنساني أم استمرار لسطوة استعمارية؟",
      content: "",
      author: {
        id: "auth-003",
        name: "د. ريم الخوري",
        created_at: "2025-01-01",
        updated_at: "2025-01-01"
      },
      category: {
        id: "cat-003",
        name_ar: "مقالات",
        slug: "articles",
        is_active: true
      },
      published_date: "2025-07-20",
      image_url: "/images/articles/restitution.png",
      audio_url: "/audio/art-001.mp3",
      tags_ar: ["فن", "تراث", "ثقافة"],
      is_featured: false,
      view_count: 0,
      like_count: 0,
      read_time_minutes: 7,
      status: "published",
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    }
  ],

  featured_programs: [
    {
      id: "prog-transit",
      slug: "transit",
      type: "video",
      title_ar: "ترانزيت",
      description_ar: "مساحة حوارية شهرية تستضيف في كل حلقة شخصية بارزة من مجالات الفكر أو السياسة أو الثقافة أو الفن",
      cover_image_url: "/images/programs/transit_cover.png",
      host_ar: "مقدم البرنامج",
      featured: true,
      episode_count: 5,
      duration_avg: 60,
      view_count: 0,
      subscriber_count: 0,
      status: "active",
      created_at: "2025-01-01",
      updated_at: "2025-01-01"
    }
  ]
}

// Helper function to map our data types to HeroSection expected format
function mapArticleForHeroSection(article: any) {
  return {
    id: article.id,
    title: article.title_ar,
    excerpt: article.summary_ar,
    author: {
      id: article.author.id,
      name: article.author.name,
      avatar: article.author.avatar
    },
    publishedAt: article.published_date,
    category: article.category_ar,
    coverImage: article.image_url,
    audioUrl: article.audio_url
  }
}

function mapProgramForHeroSection(program: any) {
  return {
    id: program.id,
    title: program.title_ar,
    description: program.description_ar,
    coverImage: program.cover_image_url || "/placeholder.svg",
    type: program.type
  }
}

export default function ArabicHomepage() {
  // Map data to match HeroSection component expectations
  const heroData = {
    latestFeatured: mapArticleForHeroSection(sampleHomepageData.hero_featured_article),
    politicalOpinions: sampleHomepageData.opinions_and_assessments
      .filter(a => a.category_ar === "آراء سياسية")
      .map(mapArticleForHeroSection),
    situationAssessments: sampleHomepageData.opinions_and_assessments
      .filter(a => a.category_ar === "تقدير موقف")
      .map(mapArticleForHeroSection),
    programs: sampleHomepageData.featured_programs.map(mapProgramForHeroSection),
    articlesByCategory: {
      "مقالات": sampleHomepageData.diverse_articles.map(mapArticleForHeroSection)
    }
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <HeroSection
        latestFeatured={heroData.latestFeatured}
        politicalOpinions={heroData.politicalOpinions}
        situationAssessments={heroData.situationAssessments}
        programs={heroData.programs}
        articlesByCategory={heroData.articlesByCategory}
        language="ar"
      />
      
      {/* Newsletter Signup Section */}
      <div className="container mx-auto px-4 py-16">
        <NewsletterSignup 
          title="انضم إلى مجتمع زوايا المعرفي"
          description="احصل على أحدث التحليلات والمقالات مع ملخصات صوتية حصرية، مباشرة في بريدك الإلكتروني"
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  )
} 