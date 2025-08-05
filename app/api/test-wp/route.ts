import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL
    const wpApiBase = process.env.WP_API_BASE
    const wpUsername = process.env.WP_USERNAME
    const wpPassword = process.env.WP_APP_PASSWORD

    console.log('Environment variables:')
    console.log('WP_URL:', wpUrl)
    console.log('WP_API_BASE:', wpApiBase)
    console.log('WP_USERNAME:', wpUsername)
    console.log('WP_PASSWORD:', wpPassword ? 'SET' : 'NOT SET')

    if (!wpUrl || !wpUsername || !wpPassword) {
      return NextResponse.json({
        success: false,
        error: 'WordPress environment variables not set',
        env: { wpUrl, wpApiBase, wpUsername, hasPassword: !!wpPassword }
      })
    }

    const authHeader = `Basic ${Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')}`
    const testUrl = `${wpApiBase || wpUrl + '/wp-json/wp/v2'}/posts?per_page=1`

    console.log('Testing URL:', testUrl)

    const response = await fetch(testUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `WordPress API error: ${response.status} ${response.statusText}`,
        url: testUrl
      })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: 'WordPress connection successful',
      postsCount: data.length,
      firstPost: data[0] ? {
        id: data[0].id,
        title: data[0].title.rendered,
        hasAcf: !!data[0].acf
      } : null
    })

  } catch (error: any) {
    console.error('WordPress test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.name
    })
  }
}