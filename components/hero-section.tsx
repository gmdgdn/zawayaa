"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Play, Calendar } from "lucide-react"
import { colors } from "@/lib/theme"

interface Author {
  id: string
  name: string
  avatar?: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  author: Author
  publishedAt: string
  category: string
  coverImage?: string
  audioUrl?: string
}

interface Program {
  id: string
  title: string
  description: string
  coverImage: string
  type: "audio" | "video"
}

interface HeroSectionProps {
  latestFeatured: Article
  politicalOpinions: Article[]
  situationAssessments: Article[]
  programs: Program[]
  articlesByCategory: {
    [category: string]: Article[]
  }
  language?: "ar" | "en"
}

export default function HeroSection({
  latestFeatured,
  politicalOpinions,
  situationAssessments,
  programs,
  articlesByCategory,
  language = "ar",
}: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState(Object.keys(articlesByCategory)[0] || "")
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0)

  const isRTL = language === "ar"

  const nextProgram = () => {
    setCurrentProgramIndex((prev) => (prev + 1) % programs.length)
  }

  const prevProgram = () => {
    setCurrentProgramIndex((prev) => (prev - 1 + programs.length) % programs.length)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (language === "ar") {
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
  }

  return (
    <div className="space-y-12 py-8">
      {/* Featured Article Hero */}
      <section className="relative">
        <Card className="overflow-hidden bg-gradient-to-r from-zawaya-primary to-zawaya-iris">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6 text-white">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {language === "ar" ? "مميز" : "Featured"}
              </Badge>
              <h1 className={`text-4xl font-bold leading-tight ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
                {latestFeatured.title}
              </h1>
              <p
                className={`text-lg text-white/90 line-clamp-3 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
              >
                {latestFeatured.excerpt}
              </p>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Avatar className="h-12 w-12 border-2 border-white/30">
                  <AvatarImage src={latestFeatured.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {getInitials(latestFeatured.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{latestFeatured.author.name}</p>
                  <p className="text-sm text-white/70 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(latestFeatured.publishedAt)}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-white text-zawaya-primary hover:bg-white/90"
                style={{ backgroundColor: "white", color: colors.primary }}
              >
                {language === "ar" ? "اقرأ المقال" : "Read Article"}
              </Button>
            </div>
            <div className="relative">
              <div
                className="w-full h-80 bg-gradient-to-br from-zawaya-accent to-zawaya-orange rounded-lg flex items-center justify-center"
                style={{
                  backgroundImage: latestFeatured.coverImage ? `url(${latestFeatured.coverImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!latestFeatured.coverImage && <div className="text-white/50 text-6xl">📰</div>}
                {latestFeatured.audioUrl && (
                  <Button
                    size="lg"
                    className="absolute bottom-4 right-4 rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  >
                    <Play className="w-6 h-6 text-white" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Political Opinions & Situation Assessments */}
      <section className="grid lg:grid-cols-2 gap-12">
        {/* Political Opinions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className={`text-2xl font-bold text-zawaya-primary ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
            >
              {language === "ar" ? "آراء سياسية" : "Political Opinions"}
            </h2>
            <Button
              variant="outline"
              className="border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white bg-transparent"
              style={
                {
                  borderColor: colors.accent,
                  color: colors.accent,
                  "--hover-bg": colors.accent,
                } as any
              }
            >
              {language === "ar" ? "المزيد" : "More"}
            </Button>
          </div>
          <div className="grid gap-4">
            {politicalOpinions.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                language={language}
                formatDate={formatDate}
                getInitials={getInitials}
              />
            ))}
          </div>
        </div>

        {/* Situation Assessments */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className={`text-2xl font-bold text-zawaya-primary ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
            >
              {language === "ar" ? "تقييم الوضع" : "Situation Assessments"}
            </h2>
            <Button
              variant="outline"
              className="border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white bg-transparent"
              style={{
                borderColor: colors.accent,
                color: colors.accent,
              }}
            >
              {language === "ar" ? "المزيد" : "More"}
            </Button>
          </div>
          <div className="grid gap-4">
            {situationAssessments.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                language={language}
                formatDate={formatDate}
                getInitials={getInitials}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Teaser Carousel */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2
            className={`text-2xl font-bold text-zawaya-primary ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
          >
            {language === "ar" ? "البرامج الصوتية" : "Podcast Programs"}
          </h2>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={prevProgram}
              className="border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white bg-transparent"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextProgram}
              className="border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white bg-transparent"
            >
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              className="border-zawaya-accent text-zawaya-accent hover:bg-zawaya-accent hover:text-white ml-4 bg-transparent"
            >
              {language === "ar" ? "المزيد" : "More"}
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{
              transform: `translateX(${isRTL ? currentProgramIndex * 320 : -currentProgramIndex * 320}px)`,
            }}
          >
            {programs.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                language={language}
                isActive={index === currentProgramIndex}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Articles by Category Tabs */}
      <section className="space-y-6">
        <h2 className={`text-2xl font-bold text-zawaya-primary ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
          {language === "ar" ? "المقالات حسب الفئة" : "Articles by Category"}
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {Object.keys(articlesByCategory).map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === category
                  ? "border-zawaya-accent text-zawaya-accent"
                  : "border-transparent text-gray-600 hover:text-zawaya-accent"
              } ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}
              style={{
                borderBottomColor: activeTab === category ? colors.accent : "transparent",
                color: activeTab === category ? colors.accent : undefined,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Category Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesByCategory[activeTab]?.slice(0, 6).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              language={language}
              formatDate={formatDate}
              getInitials={getInitials}
              variant="grid"
            />
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white"
            style={{ backgroundColor: colors.accent }}
          >
            {language === "ar" ? "المزيد من المقالات" : "More Articles"}
          </Button>
        </div>
      </section>
    </div>
  )
}

// Article Card Component
interface ArticleCardProps {
  article: Article
  language: "ar" | "en"
  formatDate: (date: string) => string
  getInitials: (name: string) => string
  variant?: "list" | "grid"
}

function ArticleCard({ article, language, formatDate, getInitials, variant = "list" }: ArticleCardProps) {
  if (variant === "grid") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <div
          className="h-48 bg-gradient-to-br from-zawaya-menthol to-zawaya-yellow flex items-center justify-center"
          style={{
            backgroundImage: article.coverImage ? `url(${article.coverImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!article.coverImage && <div className="text-white/70 text-4xl">📄</div>}
        </div>
        <div className="p-4 space-y-3">
          <h3
            className={`font-bold text-gray-900 line-clamp-2 group-hover:text-zawaya-accent transition-colors ${
              language === "ar" ? "font-ge-ss" : "font-eurostile"
            }`}
          >
            {article.title}
          </h3>
          <p className={`text-sm text-gray-600 line-clamp-2 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Avatar className="h-6 w-6">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs bg-zawaya-primary text-white">
                  {getInitials(article.author.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">{article.author.name}</span>
            </div>
            <span className="text-xs text-gray-400">{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-300 group cursor-pointer border-l-4 border-transparent hover:border-zawaya-accent">
      <div className="space-y-3">
        <h3
          className={`font-bold text-gray-900 line-clamp-2 group-hover:text-zawaya-accent transition-colors ${
            language === "ar" ? "font-ge-ss" : "font-eurostile"
          }`}
        >
          {article.title}
        </h3>
        <p className={`text-sm text-gray-600 line-clamp-2 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Avatar className="h-6 w-6">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs bg-zawaya-primary text-white">
                {getInitials(article.author.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">{article.author.name}</span>
          </div>
          <span className="text-xs text-gray-400">{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Card>
  )
}

// Program Card Component
interface ProgramCardProps {
  program: Program
  language: "ar" | "en"
  isActive: boolean
}

function ProgramCard({ program, language, isActive }: ProgramCardProps) {
  return (
    <Card
      className={`flex-shrink-0 w-80 overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive ? "ring-2 ring-zawaya-accent shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="relative">
        <div
          className="h-48 bg-gradient-to-br from-zawaya-iris to-zawaya-primary flex items-center justify-center"
          style={{
            backgroundImage: `url(${program.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Button
            size="lg"
            className="absolute inset-0 w-full h-full bg-black/20 hover:bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <Play className="w-12 h-12 text-white" />
          </Button>
        </div>
        <Badge
          className="absolute top-2 right-2 bg-zawaya-accent text-white"
          style={{ backgroundColor: colors.accent }}
        >
          {program.type === "audio" ? (language === "ar" ? "صوتي" : "Audio") : language === "ar" ? "مرئي" : "Video"}
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className={`font-bold text-gray-900 line-clamp-1 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
          {program.title}
        </h3>
        <p className={`text-sm text-gray-600 line-clamp-2 ${language === "ar" ? "font-ge-ss" : "font-eurostile"}`}>
          {program.description}
        </p>
      </div>
    </Card>
  )
}
