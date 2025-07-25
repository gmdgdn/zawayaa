"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Calendar,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  BookOpen,
  MessageSquare,
  Mic,
  Play,
  Eye,
  Heart,
  Share2,
  Clock,
  Users,
  Award,
} from "lucide-react"

// Mock data for the author
const authorData = {
  id: "dr-ahmad-mansour",
  name: "د. أحمد منصور",
  title: "محلل سياسي وكاتب",
  bio: "محلل سياسي متخصص في الشؤون الشرق أوسطية والعلاقات الدولية. حاصل على دكتوراه في العلوم السياسية من جامعة السوربون. له خبرة تزيد عن 15 عاماً في التحليل السياسي والإعلام. يكتب بانتظام في عدة منصات إعلامية عربية ودولية.",
  avatar: "/placeholder.svg?height=200&width=200&text=د.أحمد+منصور",
  location: "بيروت، لبنان",
  joinDate: "2019-03-15",
  website: "https://ahmadmansour.com",
  social: {
    twitter: "https://twitter.com/ahmadmansour",
    facebook: "https://facebook.com/ahmadmansour",
    instagram: "https://instagram.com/ahmadmansour",
    linkedin: "https://linkedin.com/in/ahmadmansour",
    email: "ahmad@zawaya.org",
  },
  stats: {
    articles: 127,
    opinions: 89,
    podcasts: 34,
    followers: 45200,
    totalViews: 2340000,
    likes: 89400,
  },
  expertise: ["السياسة الشرق أوسطية", "العلاقات الدولية", "التحليل الاستراتيجي", "الجيوسياسة"],
}

// Mock articles data
const articlesData = [
  {
    id: 1,
    title: "مستقبل النظام الإقليمي في الشرق الأوسط",
    excerpt:
      "تحليل شامل للتطورات الجيوسياسية الحالية وتأثيرها على مستقبل المنطقة. يتناول هذا المقال التحديات والفرص التي تواجه دول المنطقة في ظل التغيرات العالمية المتسارعة.",
    publishDate: "2024-01-15",
    readTime: "12 دقيقة",
    views: 15400,
    likes: 234,
    category: "تحليل سياسي",
    image: "/placeholder.svg?height=200&width=300&text=مستقبل+النظام+الإقليمي",
  },
  {
    id: 2,
    title: "التحولات الاقتصادية في المنطقة العربية",
    excerpt:
      "دراسة معمقة للتغيرات الاقتصادية والتحديات التي تواجه الدول العربية في ظل الأزمات المتتالية والتطورات التكنولوجية الحديثة.",
    publishDate: "2024-01-10",
    readTime: "8 دقائق",
    views: 12300,
    likes: 189,
    category: "اقتصاد",
    image: "/placeholder.svg?height=200&width=300&text=التحولات+الاقتصادية",
  },
  {
    id: 3,
    title: "الدبلوماسية الرقمية في العصر الحديث",
    excerpt:
      "كيف غيرت التكنولوجيا وجه الدبلوماسية وما هي التحديات الجديدة التي تواجه الدول في إدارة علاقاتها الخارجية عبر المنصات الرقمية.",
    publishDate: "2024-01-05",
    readTime: "10 دقائق",
    views: 9800,
    likes: 156,
    category: "تكنولوجيا",
    image: "/placeholder.svg?height=200&width=300&text=الدبلوماسية+الرقمية",
  },
  {
    id: 4,
    title: "أزمة المياه في الشرق الأوسط: تحديات وحلول",
    excerpt:
      "تحليل شامل لأزمة المياه في المنطقة والحلول المقترحة للتعامل مع هذا التحدي الاستراتيجي الذي يهدد الأمن والاستقرار.",
    publishDate: "2023-12-28",
    readTime: "15 دقيقة",
    views: 18900,
    likes: 298,
    category: "بيئة",
    image: "/placeholder.svg?height=200&width=300&text=أزمة+المياه",
  },
]

// Mock political opinions data
const opinionsData = [
  {
    id: 1,
    title: "قراءة في نتائج القمة العربية الأخيرة",
    excerpt:
      "رأي تحليلي حول القرارات المتخذة في القمة العربية وتأثيرها المحتمل على مستقبل العلاقات العربية-العربية والتحديات الإقليمية.",
    publishDate: "2024-01-18",
    readTime: "6 دقائق",
    views: 18700,
    likes: 312,
    category: "رأي سياسي",
    image: "/placeholder.svg?height=200&width=300&text=القمة+العربية",
  },
  {
    id: 2,
    title: "التحديات الأمنية في المنطقة: رؤية استراتيجية",
    excerpt:
      "تحليل للتحديات الأمنية الراهنة واقتراح حلول استراتيجية للمواجهة، مع التركيز على أهمية التعاون الإقليمي والدولي.",
    publishDate: "2024-01-12",
    readTime: "9 دقائق",
    views: 14200,
    likes: 267,
    category: "أمن",
    image: "/placeholder.svg?height=200&width=300&text=التحديات+الأمنية",
  },
  {
    id: 3,
    title: "مستقبل الحوار السياسي في لبنان",
    excerpt: "رؤية حول إمكانيات تطوير الحوار السياسي في لبنان والخروج من الأزمة الراهنة عبر توافقات وطنية شاملة.",
    publishDate: "2024-01-08",
    readTime: "7 دقائق",
    views: 11500,
    likes: 198,
    category: "سياسة محلية",
    image: "/placeholder.svg?height=200&width=300&text=الحوار+السياسي",
  },
]

// Mock podcast data
const podcastsData = [
  {
    id: 1,
    title: "حوار حول مستقبل الديمقراطية في العالم العربي",
    description:
      "نقاش معمق حول التحديات والفرص أمام الديمقراطية في المنطقة العربية، مع استعراض التجارب المختلفة والدروس المستفادة من التحولات السياسية الأخيرة.",
    publishDate: "2024-01-20",
    duration: "45:30",
    listens: 8900,
    likes: 234,
    program: "حدث ومعنى",
    image: "/placeholder.svg?height=200&width=300&text=الديمقراطية+العربية",
    audioUrl: "/placeholder-audio.mp3",
  },
  {
    id: 2,
    title: "الأزمة الاقتصادية العالمية وتأثيرها على المنطقة",
    description:
      "تحليل للأزمة الاقتصادية العالمية وانعكاساتها على الاقتصادات العربية، مع مناقشة السياسات المطلوبة للتعامل مع التحديات الراهنة.",
    publishDate: "2024-01-14",
    duration: "38:15",
    listens: 7200,
    likes: 189,
    program: "شمال جنوب",
    image: "/placeholder.svg?height=200&width=300&text=الأزمة+الاقتصادية",
    audioUrl: "/placeholder-audio.mp3",
  },
  {
    id: 3,
    title: "التطورات الجيوسياسية في شرق المتوسط",
    description:
      "مناقشة التطورات الجيوسياسية في منطقة شرق المتوسط وتأثيرها على التوازنات الإقليمية والمصالح العربية في المنطقة.",
    publishDate: "2024-01-07",
    duration: "42:20",
    listens: 6800,
    likes: 167,
    program: "ترانزيت",
    image: "/placeholder.svg?height=200&width=300&text=شرق+المتوسط",
    audioUrl: "/placeholder-audio.mp3",
  },
]

export default function DemoAuthorProfilePage() {
  const [activeTab, setActiveTab] = useState("articles")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "م"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "ك"
    }
    return num.toString()
  }

  const renderArticles = () => (
    <div className="space-y-6">
      {articlesData.map((article) => (
        <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                width={300}
                height={200}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <CardContent className="md:w-2/3 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-zawaya-menthol/10 text-zawaya-primary">
                  {article.category}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-ge-ss hover:text-zawaya-primary cursor-pointer">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4 font-ge-ss leading-relaxed">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(article.publishDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatNumber(article.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {article.likes}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderOpinions = () => (
    <div className="space-y-6">
      {opinionsData.map((opinion) => (
        <Card key={opinion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <Image
                src={opinion.image || "/placeholder.svg"}
                alt={opinion.title}
                width={300}
                height={200}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <CardContent className="md:w-2/3 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-zawaya-accent/10 text-zawaya-accent">
                  {opinion.category}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {opinion.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-ge-ss hover:text-zawaya-primary cursor-pointer">
                {opinion.title}
              </h3>
              <p className="text-gray-600 mb-4 font-ge-ss leading-relaxed">{opinion.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(opinion.publishDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatNumber(opinion.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {opinion.likes}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderPodcasts = () => (
    <div className="space-y-6">
      {podcastsData.map((podcast) => (
        <Card key={podcast.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative">
              <Image
                src={podcast.image || "/placeholder.svg"}
                alt={podcast.title}
                width={300}
                height={200}
                className="w-full h-48 md:h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button size="lg" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                  <Play className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>
            <CardContent className="md:w-2/3 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-zawaya-yellow/10 text-zawaya-yellow">
                  {podcast.program}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Mic className="h-4 w-4" />
                  {podcast.duration}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-ge-ss hover:text-zawaya-primary cursor-pointer">
                {podcast.title}
              </h3>
              <p className="text-gray-600 mb-4 font-ge-ss leading-relaxed">{podcast.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(podcast.publishDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {formatNumber(podcast.listens)} استماع
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {podcast.likes}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-zawaya-primary to-zawaya-primary/80 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  src={authorData.avatar || "/placeholder.svg"}
                  alt={authorData.name}
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-white/20"
                />
                <div className="absolute -bottom-2 -right-2 bg-zawaya-yellow rounded-full p-2">
                  <Award className="h-6 w-6 text-zawaya-primary" />
                </div>
              </div>
            </div>

            {/* Bio and Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 font-ge-ss">{authorData.name}</h1>
                <p className="text-xl text-white/90 mb-4 font-ge-ss">{authorData.title}</p>
                <p className="text-white/80 leading-relaxed font-ge-ss max-w-3xl">{authorData.bio}</p>
              </div>

              {/* Author Details */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{authorData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>انضم في {formatDate(authorData.joinDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a href={authorData.website} className="hover:text-white transition-colors">
                    الموقع الشخصي
                  </a>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2">
                {authorData.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a href={authorData.social.twitter} className="text-white/80 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href={authorData.social.facebook} className="text-white/80 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={authorData.social.instagram} className="text-white/80 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={authorData.social.linkedin} className="text-white/80 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${authorData.social.email}`}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold font-ge-ss">{authorData.stats.articles}</div>
                  <div className="text-sm text-white/80">مقال</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold font-ge-ss">{authorData.stats.opinions}</div>
                  <div className="text-sm text-white/80">رأي</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold font-ge-ss">{authorData.stats.podcasts}</div>
                  <div className="text-sm text-white/80">بودكاست</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold font-ge-ss">{formatNumber(authorData.stats.followers)}</div>
                  <div className="text-sm text-white/80">متابع</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setActiveTab("articles")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "articles"
                  ? "border-zawaya-primary text-zawaya-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-ge-ss">مقالات ({authorData.stats.articles})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("opinions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "opinions"
                  ? "border-zawaya-primary text-zawaya-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="font-ge-ss">آراء سياسية ({authorData.stats.opinions})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("podcasts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "podcasts"
                  ? "border-zawaya-primary text-zawaya-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="font-ge-ss">بودكاست الضيف ({authorData.stats.podcasts})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "articles" && renderArticles()}
          {activeTab === "opinions" && renderOpinions()}
          {activeTab === "podcasts" && renderPodcasts()}
        </div>
      </div>
    </div>
  )
}
