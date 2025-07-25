import { NextRequest, NextResponse } from 'next/server'
import { articleService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    let article
    
    // Check if ID is a UUID or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    if (isUUID) {
      article = await articleService.getById(id)
    } else {
      article = await articleService.getBySlug(id)
    }

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // Increment view count
    await articleService.incrementViews(article.id)

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في جلب المقال',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 