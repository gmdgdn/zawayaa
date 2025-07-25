import HeroSection from "@/components/hero-section"

// This would typically come from your API/database
const mockData = {
  latestFeatured: {
    id: "featured-1",
    title: "زوايا: منصة معرفية تربط الواقع العربي بالتحولات العالمية",
    excerpt:
      "منصة معرفية غير ربحية، ثنائية اللغة، تهدف إلى ربط الواقع العربي بالتحولات العالمية من خلال تحليلات رصينة ومتعددة الاختصاصات. نقدم مقالات وبودكاست وبرامج مرئية ووثائقيات باللغتين العربية والإنجليزية.",
    author: {
      id: "author-1",
      name: "فريق زوايا التحريري",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    publishedAt: "2025-01-15T10:00:00Z",
    category: "عن زوايا",
    coverImage: "/placeholder.svg?height=400&width=600",
  },
  politicalOpinions: [
    {
      id: "opinion-1",
      title: "مستقبل الشرق الأوسط في ظل التحولات الجيوسياسية",
      excerpt: "تحليل للتغيرات السياسية الإقليمية وتأثيرها على مستقبل المنطقة",
      author: { id: "author-2", name: "د. أحمد الخطيب", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-14T15:30:00Z",
      category: "آراء سياسية",
    },
    {
      id: "opinion-2",
      title: "الدبلوماسية الرقمية وتأثيرها على العلاقات الدولية",
      excerpt: "كيف غيرت التكنولوجيا من طبيعة العمل الدبلوماسي والعلاقات بين الدول",
      author: { id: "author-3", name: "سارة المنصوري", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-13T12:00:00Z",
      category: "آراء سياسية",
    },
    {
      id: "opinion-3",
      title: "التحديات الاقتصادية في عصر ما بعد الجائحة",
      excerpt: "نظرة على التحديات الاقتصادية التي تواجه المنطقة العربية",
      author: { id: "author-4", name: "محمد الزهراني", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-12T09:15:00Z",
      category: "آراء سياسية",
    },
    {
      id: "opinion-4",
      title: "دور الشباب في صناعة المستقبل العربي",
      excerpt: "استكشاف تأثير الجيل الجديد على المشهد السياسي والاجتماعي",
      author: { id: "author-5", name: "نور الدين علي", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-11T16:45:00Z",
      category: "آراء سياسية",
    },
  ],
  situationAssessments: [
    {
      id: "assessment-1",
      title: "تقييم الوضع في سوريا: عقد من التحولات",
      excerpt: "مراجعة شاملة للتطورات السياسية والاجتماعية في سوريا خلال العقد الماضي",
      author: { id: "author-6", name: "د. ليلى حسن", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-14T11:20:00Z",
      category: "تقييم الوضع",
    },
    {
      id: "assessment-2",
      title: "الأزمة الاقتصادية في لبنان: الأسباب والحلول",
      excerpt: "تحليل معمق للأزمة الاقتصادية اللبنانية والسبل المقترحة للخروج منها",
      author: { id: "author-7", name: "حسام الدين قاسم", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-13T14:30:00Z",
      category: "تقييم الوضع",
    },
    {
      id: "assessment-3",
      title: "العراق بين الاستقرار والتحديات الأمنية",
      excerpt: "نظرة على الوضع السياسي والأمني الحالي في العراق والتحديات المستقبلية",
      author: { id: "author-8", name: "فاطمة الكاظمي", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-12T13:15:00Z",
      category: "تقييم الوضع",
    },
    {
      id: "assessment-4",
      title: "مصر والدور الإقليمي في المشهد المتغير",
      excerpt: "تحليل لدور مصر في المنطقة وتأثيرها على التوازنات الإقليمية",
      author: { id: "author-9", name: "عمرو سالم", avatar: "/placeholder.svg?height=32&width=32" },
      publishedAt: "2025-01-11T10:00:00Z",
      category: "تقييم الوضع",
    },
  ],
  programs: [
    {
      id: "program-1",
      title: "حوارات زوايا",
      description: "برنامج حواري أسبوعي يستضيف خبراء ومفكرين لمناقشة أهم القضايا المعاصرة",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "audio" as const,
    },
    {
      id: "program-2",
      title: "نافذة على العالم",
      description: "برنامج وثائقي يستكشف الثقافات والحضارات المختلفة حول العالم",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "video" as const,
    },
    {
      id: "program-3",
      title: "تحليل الأحداث",
      description: "برنامج تحليلي يومي يتناول أهم الأحداث السياسية والاقتصادية الجارية",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "audio" as const,
    },
    {
      id: "program-4",
      title: "قصص من التاريخ",
      description: "سلسلة وثائقية تحكي قصصاً مهمة ومؤثرة من التاريخ العربي والإسلامي",
      coverImage: "/placeholder.svg?height=192&width=320",
      type: "video" as const,
    },
  ],
  articlesByCategory: {
    سياسة: [
      {
        id: "cat-politics-1",
        title: "مستقبل الديمقراطية في العالم العربي",
        excerpt: "تحليل للتجارب الديمقراطية في المنطقة والتحديات التي تواجهها في العصر الحديث",
        author: { id: "author-10", name: "د. سمير عبدالله", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-15T08:00:00Z",
        category: "سياسة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "cat-politics-2",
        title: "العلاقات العربية الدولية في عصر التعددية القطبية",
        excerpt: "كيف تتأقلم الدول العربية مع النظام العالمي الجديد والتحديات الجيوسياسية",
        author: { id: "author-11", name: "رانيا محمد", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-14T16:30:00Z",
        category: "سياسة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
    ],
    اقتصاد: [
      {
        id: "cat-economy-1",
        title: "الاقتصاد الرقمي في المنطقة العربية",
        excerpt: "فرص وتحديات التحول الرقمي في الاقتصادات العربية ودوره في التنمية المستدامة",
        author: { id: "author-12", name: "خالد النجار", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-15T12:00:00Z",
        category: "اقتصاد",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "cat-economy-2",
        title: "الطاقة المتجددة: مستقبل الاقتصاد العربي",
        excerpt: "استكشاف إمكانيات الطاقة المتجددة في تنويع الاقتصادات العربية وتحقيق الاستدامة",
        author: { id: "author-13", name: "مريم الزهراني", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-14T10:15:00Z",
        category: "اقتصاد",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
    ],
    ثقافة: [
      {
        id: "cat-culture-1",
        title: "النهضة الثقافية العربية في القرن الحادي والعشرين",
        excerpt: "نظرة على الحركة الثقافية المعاصرة في العالم العربي وتأثيرها على الهوية",
        author: { id: "author-14", name: "د. عائشة الكندي", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-15T14:20:00Z",
        category: "ثقافة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "cat-culture-2",
        title: "الأدب العربي المعاصر: اتجاهات جديدة",
        excerpt: "استكشاف التيارات الحديثة في الأدب العربي المعاصر وتأثير التكنولوجيا عليه",
        author: { id: "author-15", name: "يوسف الحكيم", avatar: "/placeholder.svg?height=32&width=32" },
        publishedAt: "2025-01-14T09:45:00Z",
        category: "ثقافة",
        coverImage: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <HeroSection
        latestFeatured={mockData.latestFeatured}
        politicalOpinions={mockData.politicalOpinions}
        situationAssessments={mockData.situationAssessments}
        programs={mockData.programs}
        articlesByCategory={mockData.articlesByCategory}
        language="ar"
      />
    </div>
  )
}
