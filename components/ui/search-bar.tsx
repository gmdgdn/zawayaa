"use client"

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  type: 'article' | 'program' | 'author'
  url: string
  excerpt?: string
}

interface SearchBarProps {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ 
  className = "", 
  placeholder = "ابحث في المقالات والبرامج...",
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches] = useState(['الذكاء الاصطناعي', 'السياسة العربية', 'الاقتصاد'])
  const [trendingSearches] = useState(['التكنولوجيا', 'الثقافة', 'التاريخ'])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery)
      setIsOpen(false)
      // In a real app, you would navigate to search results page
      console.log('Searching for:', searchQuery)
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsOpen(true)
    
    // Mock search results - in real app, this would be an API call
    if (value.length > 2) {
      setResults([
        {
          id: '1',
          title: 'الذكاء الاصطناعي في الصحافة العربية',
          type: 'article',
          url: '/ar/articles/ai-journalism',
          excerpt: 'كيف يمكن للذكاء الاصطناعي أن يغير مستقبل الإعلام العربي...'
        },
        {
          id: '2',
          title: 'برنامج تقنية وحضارة',
          type: 'program',
          url: '/ar/programs/tech-civilization',
          excerpt: 'برنامج أسبوعي يناقش تأثير التكنولوجيا على الحضارة'
        }
      ])
    } else {
      setResults([])
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query)
            }
            if (e.key === 'Escape') {
              setIsOpen(false)
            }
          }}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-body placeholder:text-stone-400 transition-all duration-200"
          dir="rtl"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-stone-200 shadow-xl z-50 max-h-96 overflow-y-auto">
          {query.length > 2 && results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-stone-500 px-3 py-2 font-bold uppercase tracking-wide">
                نتائج البحث
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSearch(result.title)}
                  className="w-full text-right p-3 hover:bg-stone-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="font-ge-ss text-ink-900 font-bold text-sm group-hover:text-primary transition-colors">
                        {result.title}
                      </div>
                      {result.excerpt && (
                        <div className="text-xs text-stone-600 mt-1 line-clamp-2">
                          {result.excerpt}
                        </div>
                      )}
                      <div className="text-xs text-stone-400 mt-1">
                        {result.type === 'article' ? 'مقال' : result.type === 'program' ? 'برنامج' : 'كاتب'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 font-bold uppercase tracking-wide">
                    <Clock className="w-3 h-3" />
                    عمليات بحث حديثة
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-xs text-stone-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {trendingSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 font-bold uppercase tracking-wide">
                    <TrendingUp className="w-3 h-3" />
                    مواضيع رائجة
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-xs transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}