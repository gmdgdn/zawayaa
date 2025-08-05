"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, FileText, Video, Headphones } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'article' | 'program' | 'podcast'
  title: string
  excerpt: string
  author: string
  category: string
  published_date: string
  image_url?: string
  view_count: number
}

export default function SearchInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data.results || [])
        setSearched(true)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />
      case 'program': return <Video className="w-4 h-4" />
      case 'podcast': return <Headphones className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'مقال'
      case 'program': return 'برنامج'
      case 'podcast': return 'بودكاست'
      default: return 'محتوى'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      {/* Search Input */}
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="ابحث في المقالات والبرامج..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin ml-2" />
          ) : (
            <Search className="w-4 h-4 ml-2" />
          )}
          بحث
        </Button>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              نتائج البحث ({results.length})
            </h3>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="p-4">
                  <div className="flex items-start gap-4">
                    {result.image_url && (
                      <img
                        src={result.image_url}
                        alt={result.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(result.type)}
                          {getTypeLabel(result.type)}
                        </Badge>
                        <Badge variant="secondary">{result.category}</Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2 line-clamp-2">
                        {result.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {result.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{result.author}</span>
                        <span>{new Date(result.published_date).toLocaleDateString('ar-SA')}</span>
                        <span>{result.view_count} مشاهدة</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600">لم يتم العثور على محتوى يطابق بحثك</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}