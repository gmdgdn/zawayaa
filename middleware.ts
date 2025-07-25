import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to login page if not authenticated
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has admin role
    if (session.user) {
      const { data: profile } = await supabase
        .from('authors')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
        // Redirect to unauthorized page if not admin/editor
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/admin/unauthorized'
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 