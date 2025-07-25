import { NextRequest, NextResponse } from 'next/server'
import { articleService, programService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    const type = searchParams.get('type') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

    if (!query.trim() && !category && !type) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'لا توجد معايير بحث'
      })
    }

    let results: any[] = []

    // Search articles
    if (!type || type === 'articles' || type === 'all') {
      try {
        const articles = await articleService.search(query, {
          category,
          limit: type === 'articles' ? limit : Math.floor(limit / 2)
        })
        
        results = results.concat(
          articles.map(article => ({
            ...article,
            content_type: 'article'
          }))
        )
      } catch (error) {
        console.error('Error searching articles:', error)
      }
    }

    // Search programs/episodes (if implemented)
    if (!type || type === 'programs' || type === 'podcasts' || type === 'all') {
      try {
        // For now, we'll use a simple program search
        // In a real implementation, you'd have a proper search function for programs
        const programs = await programService.getAll()
        
        const filteredPrograms = programs.filter(program => {
          if (query) {
            return program.title_ar?.toLowerCase().includes(query.toLowerCase()) ||
                   program.description_ar?.toLowerCase().includes(query.toLowerCase())
          }
          return true
        }).slice(0, type === 'programs' || type === 'podcasts' ? limit : Math.floor(limit / 2))

        results = results.concat(
          filteredPrograms.map(program => ({
            ...program,
            content_type: 'program'
          }))
        )
      } catch (error) {
        console.error('Error searching programs:', error)
      }
    }

    // Sort results by relevance/date
    results.sort((a, b) => {
      const dateA = new Date(a.created_at || a.published_at || 0)
      const dateB = new Date(b.created_at || b.published_at || 0)
      return dateB.getTime() - dateA.getTime()
    })

    // Limit final results
    results = results.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      query: {
        q: query,
        category,
        type,
        limit
      }
    })

  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في البحث',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 