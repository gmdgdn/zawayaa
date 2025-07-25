import { NextRequest, NextResponse } from 'next/server'
import { newsletterService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, preferences } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' },
        { status: 400 }
      )
    }

    // Subscribe user
    const subscription = await newsletterService.subscribe(email, preferences)

    return NextResponse.json({
      success: true,
      message: 'تم الاشتراك بنجاح! ستصلك نشرتنا الأسبوعية قريباً.',
      data: subscription
    })

  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    
    if (error instanceof Error && error.message.includes('مشترك بالفعل')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    await newsletterService.unsubscribe(email)

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء الاشتراك بنجاح'
    })

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ أثناء إلغاء الاشتراك',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const count = await newsletterService.getSubscriptionCount()

    return NextResponse.json({
      success: true,
      data: {
        subscriberCount: count
      }
    })

  } catch (error) {
    console.error('Error getting newsletter stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في جلب إحصائيات النشرة البريدية',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 