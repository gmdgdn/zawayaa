import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Pause, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Download,
  Headphones,
  Mic,
  Users,
  Star,
  TrendingUp,
  Podcast
} from "lucide-react"
import EnhancedAudioPlayer from "@/components/enhanced-audio-player"

// Sample podcast data based on the content guide
const podcastShows = [
  {
    id: "show-001",
    title: "حوارات زوايا",
    description: "برنامج حواري أسبوعي يستضيف خبراء ومفكرين لمناقشة أهم القضايا المعاصرة",
    host: "فريق زوايا التحريري",
    episodes: 24,
    subscribers: 15600,
    rating: 4.8,
    image: "/images/podcasts/zawaya_conversations.png",
    category: "حوارات",
    schedule: "أسبوعياً - الثلاثاء"
  },
  {
    id: "show-002", 
    title: "عقول عربية",
    description: "سلسلة تسلط الضوء على المفكرين والعلماء العرب المعاصرين وإنجازاتهم",
    host: "د. ليلى حسن",
    episodes: 18,
    subscribers: 12400,
    rating: 4.9,
    image: "/images/podcasts/arab_minds.png",
    category: "شخصيات",
    schedule: "كل أسبوعين - الأحد"
  },
  {
    id: "show-003",
    title: "تحليل الأحداث",
    description: "برنامج تحليلي يومي يتناول أهم الأحداث السياسية والاقتصادية الجارية",
    host: "أحمد الخطيب",
    episodes: 156,
    subscribers: 23800,
    rating: 4.7,
    image: "/images/podcasts/news_analysis.png",
    category: "سياسة",
    schedule: "يومياً - 6 مساءً"
  }
]

const featuredEpisodes = [
  {
    id: "ep-001",
    title: "الذكاء الاصطناعي والهوية الثقافية العربية",
    description: "حوار مع د. أمين رشدي حول تأثير الذكاء الاصطناعي على الثقافة العربية المعاصرة",
    show: "حوارات زوايا",
    host: "فريق زوايا",
    guest: "د. أمين رشدي",
    duration: "45:32",
    published_date: "2025-07-25",
    view_count: 8900,
    likes: 234,
    src: "/audio/ep-001.mp3",
    image: "/images/episodes/ai_culture.png",
    tags: ["ذكاء اصطناعي", "ثقافة", "تكنولوجيا", "هوية"]
  },
  {
    id: "ep-002",
    title: "الأدب العربي في العصر الرقمي",
    description: "نقاش معمق حول تأثير التكنولوجيا الرقمية على الكتابة والنشر في العالم العربي",
    show: "عقول عربية",
    host: "د. ليلى حسن",
    guest: "د. سامي العيسى",
    duration: "38:15",
    published_date: "2025-07-22",
    view_count: 6700,
    likes: 189,
    src: "/audio/ep-002.mp3",
    image: "/images/episodes/digital_literature.png",
    tags: ["أدب", "تكنولوجيا", "نشر", "كتابة"]
  },
  {
    id: "ep-003",
    title: "التحولات الجيوسياسية في الشرق الأوسط",
    description: "تحليل شامل للتغيرات السياسية الجارية في المنطقة وتأثيرها على المستقبل",
    show: "تحليل الأحداث",
    host: "أحمد الخطيب",
    guest: "د. مها الأحمد",
    duration: "28:47",
    published_date: "2025-07-20",
    view_count: 12300,
    likes: 456,
    src: "/audio/ep-003.mp3",
    image: "/images/episodes/geopolitics.png",
    tags: ["جيوسياسة", "شرق أوسط", "سياسة", "تحليل"]
  },
  {
    id: "ep-004",
    title: "الفن الإسلامي بين التراث والمعاصرة",
    description: "رحلة في تاريخ الفن الإسلامي وتطوره في العصر الحديث",
    show: "حوارات زوايا",
    host: "فريق زوايا", 
    guest: "د. ريم الخوري",
    duration: "42:18",
    published_date: "2025-07-18",
    view_count: 5600,
    likes: 167,
    src: "/audio/ep-004.mp3",
    image: "/images/episodes/islamic_art.png",
    tags: ["فن إسلامي", "تراث", "ثقافة", "تاريخ"]
  }
]

const categories = [
  { id: "all", name: "الكل", count: 48 },
  { id: "conversations", name: "حوارات", count: 24 },
  { id: "politics", name: "سياسة", count: 12 },
  { id: "culture", name: "ثقافة", count: 8 },
  { id: "technology", name: "تكنولوجيا", count: 4 }
]

// Convert episodes to audio tracks format
const audioTracks = featuredEpisodes.map(episode => ({
  id: episode.id,
  title: episode.title,
  author: episode.host,
  duration: episode.duration,
  src: episode.src,
  image: episode.image,
  description: episode.description
}))

export default function PodcastPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="text-center bg-gradient-to-r from-zawaya-primary to-zawaya-accent text-white p-12 rounded-2xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Podcast className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 font-ge-ss">بودكاست زوايا</h1>
            <p className="text-xl mb-6 font-ge-ss max-w-3xl mx-auto">
              محتوى صوتي متنوع يغطي أهم القضايا المعاصرة من خلال حوارات عميقة مع خبراء ومفكرين عرب
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                <span>48+ حلقة</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>50K+ مستمع</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>4.8 تقييم</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Audio Player */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">المشغل الصوتي</h2>
          <EnhancedAudioPlayer 
            tracks={audioTracks}
            showPlaylist={true}
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="episodes" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="episodes" className="font-ge-ss">الحلقات المميزة</TabsTrigger>
            <TabsTrigger value="shows" className="font-ge-ss">البرامج</TabsTrigger>
            <TabsTrigger value="trending" className="font-ge-ss">الأكثر استماعاً</TabsTrigger>
          </TabsList>

          {/* Featured Episodes */}
          <TabsContent value="episodes">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-ge-ss">الحلقات المميزة</h2>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Badge 
                      key={category.id} 
                      variant={category.id === "all" ? "default" : "secondary"}
                      className="cursor-pointer font-ge-ss"
                    >
                      {category.name} ({category.count})
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {featuredEpisodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Podcast Shows */}
          <TabsContent value="shows">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">برامجنا الصوتية</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {podcastShows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Trending */}
          <TabsContent value="trending">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-zawaya-primary" />
                الأكثر استماعاً هذا الأسبوع
              </h2>
              <div className="space-y-4">
                {featuredEpisodes
                  .sort((a, b) => b.view_count - a.view_count)
                  .map((episode, index) => (
                    <TrendingEpisodeCard key={episode.id} episode={episode} rank={index + 1} />
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="p-8 text-center mt-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-zawaya-primary/10 rounded-full">
              <Mic className="w-8 h-8 text-zawaya-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-ge-ss">
            هل لديك فكرة لحلقة بودكاست؟
          </h3>
          <p className="text-gray-600 mb-6 font-ge-ss max-w-2xl mx-auto">
            نحن دائماً نبحث عن أفكار جديدة ومثيرة لحلقات البودكاست. 
            شاركنا اقتراحاتك أو ترشح نفسك كضيف في إحدى حلقاتنا.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss">
              اقترح موضوع
            </Button>
            <Button variant="outline" className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss">
              كن ضيفاً معنا
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function EpisodeCard({ episode }: { episode: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="aspect-square bg-gray-200 relative">
            <img 
              src={episode.image} 
              alt={episode.title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-3 right-3 bg-zawaya-primary text-white text-sm">
              {episode.show}
            </Badge>
          </div>
        </div>
        <div className="md:w-2/3 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-ge-ss line-clamp-2">
            {episode.title}
          </h3>
          
          <p className="text-gray-600 mb-4 font-ge-ss line-clamp-2 text-sm">
            {episode.description}
          </p>

          {/* Episode Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="font-ge-ss">{episode.host}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(episode.published_date).toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{episode.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{episode.view_count.toLocaleString('ar-SA')}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {episode.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs font-ge-ss">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss text-sm"
            >
              <Play className="w-4 h-4 ml-2" />
              استمع الآن
            </Button>
            
            <Button variant="outline" size="icon" className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ShowCard({ show }: { show: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        <img 
          src={show.image} 
          alt={show.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-zawaya-accent text-white text-sm">
          {show.category}
        </Badge>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 font-ge-ss">
          {show.title}
        </h3>
        
        <p className="text-gray-600 mb-4 font-ge-ss text-sm line-clamp-2">
          {show.description}
        </p>

        {/* Show Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Headphones className="w-3 h-3" />
            <span>{show.episodes} حلقة</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{show.subscribers.toLocaleString('ar-SA')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{show.rating}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 font-ge-ss mb-3">
            <strong>المضيف:</strong> {show.host}
          </p>
          <p className="text-sm text-gray-600 font-ge-ss mb-4">
            <strong>الجدولة:</strong> {show.schedule}
          </p>
          
          <Button className="w-full bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss">
            تصفح الحلقات
          </Button>
        </div>
      </div>
    </Card>
  )
}

function TrendingEpisodeCard({ episode, rank }: { episode: any, rank: number }) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-zawaya-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
            {rank}
          </div>
        </div>
        
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={episode.image} 
            alt={episode.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 font-ge-ss truncate">
            {episode.title}
          </h4>
          <p className="text-sm text-gray-600 font-ge-ss truncate">
            {episode.show} • {episode.host}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>{episode.duration}</span>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{episode.view_count.toLocaleString('ar-SA')}</span>
            </div>
          </div>
        </div>

        <Button 
          size="sm"
          className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
} 