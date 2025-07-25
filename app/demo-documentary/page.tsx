"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Calendar, Eye, Share2, Download, Heart } from "lucide-react"
import { colors } from "@/lib/theme"

interface Documentary {
  id: string
  title: string
  synopsis: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
  releaseDate: string
  director: string
  category: string
  views: number
  likes: number
  tags: string[]
  featured?: boolean
}

// Sample documentary data
const documentaries: Documentary[] = [
  {
    id: "1",
    title: "Voices from the East",
    synopsis:
      "An exploratory journey through the history and culture of the Arab region, highlighting forgotten stories and influential figures who shaped our contemporary identity.",
    description:
      "A comprehensive documentary that addresses cultural and social developments in the Arab region during the twentieth century, through live testimonies and rare archival materials. The film explores how contemporary Arab identity was formed and the impact of historical events on Arab societies today.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "52:30",
    releaseDate: "2024-01-15",
    director: "Ahmed Al-Masri",
    category: "History & Culture",
    views: 125000,
    likes: 8500,
    tags: ["history", "culture", "identity", "arab"],
    featured: true,
  },
  {
    id: "2",
    title: "Desert Cities",
    synopsis:
      "Exploration of ancient civilizations that flourished in the heart of the Arabian desert, and how they adapted to the harsh environment to build thriving societies.",
    description:
      "A stunning visual journey through ancient desert cities, revealing the secrets of civilizations that flourished in the harshest environments. The documentary traces ancient trade routes and architectural and social innovations that enabled these communities to survive and thrive.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "48:15",
    releaseDate: "2024-02-20",
    director: "Fatima Al-Zahrani",
    category: "History & Archaeology",
    views: 98000,
    likes: 6200,
    tags: ["desert", "civilization", "archaeology", "trade"],
  },
  {
    id: "3",
    title: "Arab Thought Pioneers",
    synopsis:
      "Exclusive interviews with prominent contemporary Arab thinkers and philosophers, discussing their vision for the future and challenges of modern Arab thought.",
    description:
      "A series of in-depth interviews with elite Arab thinkers, exploring their ideas about contemporary challenges and proposed solutions for Arab intellectual renaissance. The documentary discusses issues of identity, modernity and heritage in a changing global context.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "65:45",
    releaseDate: "2024-03-10",
    director: "Mohammed Al-Asaad",
    category: "Philosophy & Thought",
    views: 156000,
    likes: 12000,
    tags: ["thought", "philosophy", "intellectuals", "renaissance"],
  },
  {
    id: "4",
    title: "Sea and Civilization",
    synopsis:
      "How seas and oceans shaped Arab civilization throughout history, from maritime trade to geographical explorations and cultural exchange.",
    description:
      "A documentary that traces the deep relationship between Arab peoples and the sea, from ancient navigation in the Indian Ocean to trade across the Mediterranean. It explores how the sea influenced the development of coastal cities and Arab maritime culture.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "55:20",
    releaseDate: "2024-04-05",
    director: "Layla Al-Bahrani",
    category: "Maritime History",
    views: 87000,
    likes: 5800,
    tags: ["sea", "trade", "navigation", "civilization"],
  },
  {
    id: "5",
    title: "Language of Dhad",
    synopsis:
      "A journey through the history of the Arabic language and its development through the ages, from pre-Islamic poetry to contemporary literature, and its impact on world culture.",
    description:
      "A comprehensive exploration of the history of the Arabic language and its civilizational impact, tracing the development of Arabic literature and poetry and the role of language in transmitting knowledge and sciences. It highlights the contributions of the Arabic language to human civilization.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "72:10",
    releaseDate: "2024-05-12",
    director: "Abdul Rahman Al-Katib",
    category: "Language & Literature",
    views: 203000,
    likes: 15500,
    tags: ["language", "literature", "poetry", "calligraphy"],
  },
  {
    id: "6",
    title: "Women in Arab History",
    synopsis:
      "Stories of Arab women who left their mark in history, from queens and poets to scientists and warriors, and their contributions to building civilization.",
    description:
      "A documentary celebrating the achievements of Arab women throughout history, telling the stories of influential female figures in various fields. From Zenobia, Queen of Palmyra, to Rabia Al-Adawiyya and Al-Khansa, it explores the role of women in shaping Arab civilization.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "/placeholder-video.mp4",
    duration: "58:35",
    releaseDate: "2024-06-18",
    director: "Nora Al-Salem",
    category: "Social History",
    views: 142000,
    likes: 11200,
    tags: ["women", "history", "personalities", "achievements"],
  },
]

const featuredDocumentary = documentaries.find((doc) => doc.featured) || documentaries[0]

export default function DemoDocumentaryPage() {
  const [selectedDocumentary, setSelectedDocumentary] = useState<Documentary | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const bannerVideoRef = useRef<HTMLVideoElement>(null)

  // Auto-play banner video on mount
  useEffect(() => {
    if (bannerVideoRef.current) {
      bannerVideoRef.current.play().catch(console.error)
    }
  }, [])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Banner with Auto-Playing Video */}
      <section className="relative h-screen overflow-hidden">
        <video
          ref={bannerVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/placeholder-video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center space-y-8 max-w-4xl px-6">
            <h1 className="text-6xl md:text-8xl font-bold font-eurostile mb-6">Zawaya Documentaries</h1>
            <p className="text-xl md:text-2xl text-gray-200 font-eurostile leading-relaxed max-w-3xl mx-auto">
              Explore the world of distinguished Arabic documentaries, where real stories meet creative storytelling to
              give you an unforgettable visual experience
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Button
                size="lg"
                className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white px-8 py-4 text-lg font-eurostile"
                style={{ backgroundColor: colors.accent }}
              >
                <Play className="w-6 h-6 mr-2" />
                Start Watching
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-eurostile bg-transparent"
              >
                Browse Collection
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Documentary Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-zawaya-accent text-white mb-4 px-4 py-2 text-lg font-eurostile">
              Featured This Month
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-eurostile mb-6">{featuredDocumentary.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-eurostile leading-relaxed">
              {featuredDocumentary.synopsis}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group cursor-pointer" onClick={() => setSelectedDocumentary(featuredDocumentary)}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={featuredDocumentary.thumbnail || "/placeholder.svg"}
                  alt={featuredDocumentary.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-20 h-20 transition-all duration-300 group-hover:scale-110"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-eurostile">{featuredDocumentary.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-eurostile">{formatDate(featuredDocumentary.releaseDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-eurostile">{formatViews(featuredDocumentary.views)} views</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2 font-eurostile">Director</h3>
                  <p className="text-white font-eurostile">{featuredDocumentary.director}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2 font-eurostile">Category</h3>
                  <Badge className="bg-zawaya-primary text-white font-eurostile">{featuredDocumentary.category}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {featuredDocumentary.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 font-eurostile"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white w-full font-eurostile"
                onClick={() => setSelectedDocumentary(featuredDocumentary)}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Documentary Grid */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-eurostile mb-6">Documentary Collection</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-eurostile leading-relaxed">
              Discover a diverse collection of distinguished Arabic documentaries covering various aspects of Arab
              history, culture and thought
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {documentaries.map((documentary) => (
              <Card
                key={documentary.id}
                className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedDocumentary(documentary)}
              >
                <div className="relative">
                  <img
                    src={documentary.thumbnail || "/placeholder.svg"}
                    alt={documentary.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-16 h-16">
                      <Play className="w-6 h-6 text-white" />
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <Badge className="absolute bottom-4 right-4 bg-black/70 text-white font-eurostile">
                    {documentary.duration}
                  </Badge>

                  {/* Category Badge */}
                  <Badge className="absolute top-4 right-4 bg-zawaya-accent text-white font-eurostile">
                    {documentary.category}
                  </Badge>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-zawaya-accent transition-colors font-eurostile">
                    {documentary.title}
                  </h3>

                  <p className="text-gray-300 line-clamp-3 font-eurostile leading-relaxed">{documentary.synopsis}</p>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-eurostile">{formatViews(documentary.views)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="font-eurostile">{formatViews(documentary.likes)}</span>
                      </div>
                    </div>
                    <span className="font-eurostile">{formatDate(documentary.releaseDate)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-eurostile">Director: {documentary.director}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={!!selectedDocumentary} onOpenChange={() => setSelectedDocumentary(null)}>
        <DialogContent className="max-w-6xl w-full bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-eurostile text-left">
              {selectedDocumentary?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedDocumentary && (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  poster={selectedDocumentary.thumbnail}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                >
                  <source src={selectedDocumentary.videoUrl} type="video/mp4" />
                </video>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleMuteToggle}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      <span className="text-white text-sm font-eurostile">
                        {Math.floor(currentTime / 60)}:
                        {Math.floor(currentTime % 60)
                          .toString()
                          .padStart(2, "0")}{" "}
                        / {selectedDocumentary.duration}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Documentary Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-eurostile">About the Documentary</h3>
                  <p className="text-gray-300 font-eurostile leading-relaxed">{selectedDocumentary.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedDocumentary.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300 font-eurostile">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-eurostile">Production Details</h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-eurostile">Director:</span>
                      <span className="font-eurostile">{selectedDocumentary.director}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-eurostile">Duration:</span>
                      <span className="font-eurostile">{selectedDocumentary.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-eurostile">Release Date:</span>
                      <span className="font-eurostile">{formatDate(selectedDocumentary.releaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-eurostile">Category:</span>
                      <span className="font-eurostile">{selectedDocumentary.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-eurostile">Views:</span>
                      <span className="font-eurostile">{formatViews(selectedDocumentary.views)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-eurostile">Likes:</span>
                      <span className="font-eurostile">{formatViews(selectedDocumentary.likes)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white flex-1 font-eurostile"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Like
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 font-eurostile bg-transparent"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 font-eurostile bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
