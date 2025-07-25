"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Article {
  id: string
  title_ar: string
  author: string
  summary_ar: string
}

interface AnalysisTabsData {
  title_ar: string
  opinions: Article[]
  articles: Article[]
}

interface AnalysisTabsProps {
  data: AnalysisTabsData
}

interface ArticleCardProps {
  article: Article
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/ar/articles/${article.id}`}>
      <Card className="p-6 card group cursor-pointer border-t-4 border-transparent hover:border-clr-accent">
        <div className="space-y-4">
          {/* Article Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-clr-accent transition-default font-ge-ss leading-body text-balance">
            {article.title_ar}
          </h3>
          
          {/* Author */}
          <p className="text-clr-iris font-semibold font-ge-ss">
            {article.author}
          </p>
          
          {/* Summary */}
          <p className="text-gray-600 font-ge-ss leading-relaxed text-balance line-clamp-3">
            {article.summary_ar}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export default function AnalysisTabs({ data }: AnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState<"opinions" | "articles">("opinions")

  const tabs = {
    opinions: {
      label: "آراء سياسية",
      articles: data.opinions
    },
    articles: {
      label: "مقالات",
      articles: data.articles
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-clr-iris mb-12 font-ge-ss text-center section-heading">
          تحليلات وزوايا
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-12 border-b border-gray-200">
          {Object.entries(tabs).map(([key, tab]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "opinions" | "articles")}
              className={`px-8 py-4 font-bold text-lg transition-default border-b-4 font-ge-ss ${
                activeTab === key
                  ? "border-clr-accent text-clr-accent"
                  : "border-transparent text-gray-600 hover:text-clr-accent hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tabs[activeTab].articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
} 