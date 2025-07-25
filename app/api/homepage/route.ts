import { NextRequest, NextResponse } from 'next/server'
import { homepageService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const content = await homepageService.getContent()

    return NextResponse.json({
      success: true,
      data: content
    })

  } catch (error) {
    console.error('Error fetching homepage content:', error)
    
    // If there's a database error, return fallback content
    // This ensures the homepage still works even if DB is not set up
    return NextResponse.json({
      success: false,
      error: 'Database not available - using fallback content',
      fallback: true,
      data: {
        featuredArticle: null,
        politicalOpinions: [],
        situationAssessments: [],
        programs: [],
        articlesByCategory: {}
      }
    })
  }
} 