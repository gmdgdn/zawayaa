"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, Calendar, User, Play, FileText, Clock, Eye, Heart, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock Typesense client for demonstration
const mockTypesenseClient = {
  search: async (query: string, filters: any = {}) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const mockResults = [
      {
        id: "1",
        title: "The Impact of AI on Future Technology",
        content:
          "A comprehensive article about how artificial intelligence will shape various aspects of life and work in the near future...",
        type: "article",
        author: "Dr. Ahmed Mohammed",
        date: "2024-01-15",
        category: "Technology",
        tags: ["AI", "Future", "Technology"],
        views: 15420,
        likes: 342,
        duration: null,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        title: "Episode: The Future of Renewable Energy",
        content:
          "In-depth discussion about recent developments in renewable energy and their impact on environment and economy...",
        type: "episode",
        author: "Transit Program",
        date: "2024-01-12",
        category: "Environment",
        tags: ["Renewable Energy", "Environment", "Economy"],
        views: 8750,
        likes: 156,
        duration: "45:30",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        title: "Digital Revolution in Education",
        content: "Exploring how digital technology is changing teaching and learning methods in the modern era...",
        type: "article",
        author: "Sarah Ahmed",
        date: "2024-01-10",
        category: "Education",
        tags: ["Digital Education", "Technology", "Development"],
        views: 12300,
        likes: 289,
        duration: null,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        title: "Episode: History of Ancient Civilizations",
        content:
          "A journey through history to explore the greatest ancient civilizations and their lasting achievements...",
        type: "episode",
        author: "Event and Meaning Program",
        date: "2024-01-08",
        category: "History",
        tags: ["History", "Civilizations", "Culture"],
        views: 6890,
        likes: 134,
        duration: "52:15",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "5",
        title: "Digital Economy and Cryptocurrencies",
        content:
          "Comprehensive analysis of the digital economy and the impact of cryptocurrencies on the global financial system...",
        type: "article",
        author: "Mohammed Al-Khalidi",
        date: "2024-01-05",
        category: "Economy",
        tags: ["Digital Economy", "Cryptocurrency", "Finance"],
        views: 18650,
        likes: 421,
        duration: null,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "6",
        title: "Episode: Contemporary Art in the Middle East",
        content: "Exploring contemporary artistic movements in the Arab region and their impact on culture...",
        type: "episode",
        author: "North South Program",
        date: "2024-01-03",
        category: "Art & Culture",
        tags: ["Contemporary Art", "Culture", "Middle East"],
        views: 5420,
        likes: 98,
        duration: "38:45",
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    // Filter results based on query
    if (query) {
      return mockResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
          item.author.toLowerCase().includes(query.toLowerCase()),
      )
    }

    return mockResults
  },

  autocomplete: async (query: string) => {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const suggestions = [
      "Artificial Intelligence",
      "Renewable Energy",
      "Digital Education",
      "Ancient Civilizations",
      "Digital Economy",
      "Contemporary Art",
      "Technology",
      "Environment and Climate",
      "Arab Culture",
      "Islamic History",
    ]

    return suggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()) && query.length > 0)
      .slice(0, 5)
  },
}

interface SearchResult {
  id: string
  title: string
  content: string
  type: "article" | "episode"
  author: string
  date: string
  category: string
  tags: string[]
  views: number
  likes: number
  duration?: string
  image: string
}

export default function DemoSearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{
    type: string[]
    category: string[]
    dateRange: string
  }>({
    type: [],
    category: [],
    dateRange: "all",
  })
  const [showFilters, setShowFilters] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load initial results
  useEffect(() => {
    loadResults("")
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 0) {
        loadResults(query)
        loadSuggestions(query)
      } else {
        loadResults("")
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const loadResults = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const searchResults = await mockTypesenseClient.search(searchQuery, selectedFilters)
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSuggestions = async (searchQuery: string) => {
    try {
      const autocompleteSuggestions = await mockTypesenseClient.autocomplete(searchQuery)
      setSuggestions(autocompleteSuggestions)
      setShowSuggestions(autocompleteSuggestions.length > 0)
    } catch (error) {
      console.error("Autocomplete error:", error)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      if (filterType === "type" || filterType === "category") {
        const currentValues = newFilters[filterType as keyof typeof newFilters] as string[]
        if (currentValues.includes(value)) {
          newFilters[filterType as keyof typeof newFilters] = currentValues.filter((v) => v !== value) as any
        } else {
          newFilters[filterType as keyof typeof newFilters] = [...currentValues, value] as any
        }
      } else {
        newFilters[filterType as keyof typeof newFilters] = value as any
      }
      return newFilters
    })
  }

  const clearFilters = () => {
    setSelectedFilters({
      type: [],
      category: [],
      dateRange: "all",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Search</h1>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles and episodes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                className="pl-10 pr-4 py-3 text-lg"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("")
                    setShowSuggestions(false)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Content Type Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Content Type</h3>
                <div className="space-y-2">
                  {[
                    { value: "article", label: "Articles" },
                    { value: "episode", label: "Episodes" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.type.includes(option.value)}
                        onChange={() => handleFilterChange("type", option.value)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {["Technology", "Environment", "Education", "History", "Economy", "Art & Culture"].map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.category.includes(category)}
                        onChange={() => handleFilterChange("category", category)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Date Range</h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Time" },
                    { value: "week", label: "Past Week" },
                    { value: "month", label: "Past Month" },
                    { value: "year", label: "Past Year" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="dateRange"
                        value={option.value}
                        checked={selectedFilters.dateRange === option.value}
                        onChange={() => handleFilterChange("dateRange", option.value)}
                        className="border-gray-300"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {query ? `Search results for "${query}"` : "All Results"}
            </h2>
            <span className="text-gray-500">({results.length} results)</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={result.image || "/placeholder.svg"}
                    alt={result.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={result.type === "article" ? "default" : "secondary"}>
                      {result.type === "article" ? (
                        <>
                          <FileText className="w-3 h-3 mr-1" /> Article
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" /> Episode
                        </>
                      )}
                    </Badge>
                  </div>
                  {result.duration && (
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                        <Clock className="w-3 h-3 mr-1" />
                        {result.duration}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{result.category}</Badge>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{result.title}</h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{result.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {result.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{result.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(result.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatViews(result.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{result.likes}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && results.length === 0 && query && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">We couldn't find any results matching "{query}"</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("")
                clearFilters()
              }}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
