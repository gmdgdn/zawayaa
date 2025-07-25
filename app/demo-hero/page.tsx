import HeroSection from "@/components/hero-section"

// Sample data
const sampleData = {
  latestFeatured: {
    id: "1",
    title: "مستقبل الذكاء الاصطناعي في العالم العربي: فرص وتحديات",
    excerpt:
      "تحليل شامل للتطورات الحديثة في مجال الذكاء الاصطناعي وتأثيرها على المنطقة العربية، مع استكشاف الفرص المتاحة والتحديات التي تواجه التطبيق الفعال لهذه التقنيات في مختلف القطاعات.",
    author: {
      id: "1",
      name: "د. أحمد محمد",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    publishedAt: "2025-01-15T10:00:00Z",
    category: "تكنولوجيا",
    coverImage: "/placeholder.svg?height=320&width=480",
    audioUrl: "/sample-audio.mp3",
  },
  politicalOpinions: [
    {
      id: "2",
      title: "التحولات الجيوسياسية في الشرق الأوسط",
      excerpt: "نظرة على التغيرات السياسية الحديثة وتأثيرها على المنطقة",
      author: { id: "2", name: "سارة أحمد", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-14T15:30:00Z",
      category: "سياسة",
    },
    {
      id: "3",
      title: "الدبلوماسية الرقمية في عصر وسائل التواصل",
      excerpt: "كيف غيرت وسائل التواصل الاجتماعي من طبيعة العمل الدبلوماسي",
      author: { id: "3", name: "محمد علي", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-13T12:00:00Z",
      category: "سياسة",
    },
    {
      id: "4",
      title: "التحديات الاقتصادية في المنطقة العربية",
      excerpt: "تحليل للوضع الاقتصادي الحالي والتوقعات المستقبلية",
      author: { id: "4", name: "فاطمة حسن", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-12T09:15:00Z",
      category: "اقتصاد",
    },
    {
      id: "5",
      title: "دور الشباب في التغيير السياسي",
      excerpt: "استكشاف تأثير الجيل الجديد على المشهد السياسي العربي",
      author: { id: "5", name: "عمر خالد", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-11T16:45:00Z",
      category: "مجتمع",
    },
  ],
  situationAssessments: [
    {
      id: "6",
      title: "تقييم الوضع في سوريا: عقد من التحولات",
      excerpt: "مراجعة شاملة للتطورات السياسية والاجتماعية في سوريا",
      author: { id: "6", name: "ليلى محمود", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-14T11:20:00Z",
      category: "تحليل",
    },
    {
      id: "7",
      title: "الوضع الاقتصادي في لبنان: التحديات والحلول",
      excerpt: "نظرة على الأزمة الاقتصادية اللبنانية والسبل المقترحة للخروج منها",
      author: { id: "7", name: "حسام الدين", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-13T14:30:00Z",
      category: "اقتصاد",
    },
    {
      id: "8",
      title: "التطورات في العراق: بين الاستقرار والتحديات",
      excerpt: "تحليل للوضع السياسي والأمني الحالي في العراق",
      author: { id: "8", name: "نور الهدى", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-12T13:15:00Z",
      category: "سياسة",
    },
    {
      id: "9",
      title: "مصر والتحولات الإقليمية الجديدة",
      excerpt: "دور مصر في المشهد الإقليمي المتغير وتأثيرها على المنطقة",
      author: { id: "9", name: "أحمد سالم", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-11T10:00:00Z",
      category: "سياسة",
    },
  ],
  programs: [
    {
      id: "1",
      title: "حوارات زوايا",
      description: "برنامج حواري أسبوعي يستضيف خبراء ومفكرين لمناقشة القضايا المعاصرة",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "audio" as const,
    },
    {
      id: "2",
      title: "نافذة على العالم",
      description: "برنامج وثائقي يستكشف الثقافات والحضارات المختلفة حول العالم",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "video" as const,
    },
    {
      id: "3",
      title: "تحليل الأحداث",
      description: "برنامج تحليلي يومي يتناول أهم الأحداث السياسية والاقتصادية",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "audio" as const,
    },
    {
      id: "4",
      title: "قصص من التاريخ",
      description: "سلسلة وثائقية تحكي قصصاً مهمة من التاريخ العربي والإسلامي",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "video" as const,
    },
    {
      id: "5",
      title: "آفاق المستقبل",
      description: "برنامج يستشرف المستقبل ويناقش التطورات التكنولوجية والعلمية",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "audio" as const,
    },
  ],
  articlesByCategory: {
    سياسة: [
      {
        id: "10",
        title: "مستقبل الديمقراطية في العالم العربي",
        excerpt: "تحليل للتجارب الديمقراطية في المنطقة والتحديات التي تواجهها",
        author: { id: "10", name: "د. سمير عبدالله", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-15T08:00:00Z",
        category: "سياسة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "11",
        title: "العلاقات العربية الدولية في عصر التعددية القطبية",
        excerpt: "كيف تتأقلم الدول العربية مع النظام العالمي الجديد",
        author: { id: "11", name: "رانيا محمد", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-14T16:30:00Z",
        category: "سياسة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
    ],
    اقتصاد: [
      {
        id: "12",
        title: "الاقتصاد الرقمي في المنطقة العربية",
        excerpt: "فرص وتحديات التحول الرقمي في الاقتصادات العربية",
        author: { id: "12", name: "خالد النجار", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-15T12:00:00Z",
        category: "اقتصاد",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "13",
        title: "الطاقة المتجددة: مستقبل الاقتصاد العربي",
        excerpt: "استكشاف إمكانيات الطاقة المتجددة في تنويع الاقتصادات العربية",
        author: { id: "13", name: "مريم الزهراني", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-14T10:15:00Z",
        category: "اقتصاد",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
    ],
    ثقافة: [
      {
        id: "14",
        title: "النهضة الثقافية العربية في القرن الحادي والعشرين",
        excerpt: "نظرة على الحركة الثقافية المعاصرة في العالم العربي",
        author: { id: "14", name: "د. عائشة الكندي", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-15T14:20:00Z",
        category: "ثقافة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "15",
        title: "الأدب العربي المعاصر: اتجاهات جديدة",
        excerpt: "استكشاف التيارات الحديثة في الأدب العربي المعاصر",
        author: { id: "15", name: "يوسف الحكيم", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-14T09:45:00Z",
        category: "ثقافة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
}

export default function DemoHeroPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection
        latestFeatured={sampleData.latestFeatured}
        politicalOpinions={sampleData.politicalOpinions}
        situationAssessments={sampleData.situationAssessments}
        programs={sampleData.programs}
        articlesByCategory={sampleData.articlesByCategory}
        language="ar"
      />
    </div>
  )
}
