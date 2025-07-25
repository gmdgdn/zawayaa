import { NextRequest, NextResponse } from 'next/server'
import { articleService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      category: searchParams.get('category') || undefined,
      author: searchParams.get('author') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    )

    const articles = await articleService.getAll(cleanFilters)

    return NextResponse.json({
      success: true,
      data: articles,
      count: articles.length
    })

  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في جلب المقالات',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // This would create a new article (admin only)
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      message: 'Article creation endpoint - implementation pending',
      data: body
    })

  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في إنشاء المقال',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 