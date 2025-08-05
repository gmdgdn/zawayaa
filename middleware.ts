import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Skip middleware for API routes and static files
  const isApiRoute = pathname.startsWith('/api')
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next')

  // Handle locale redirection for non-API routes
  if (!isApiRoute && !isStaticFile) {
    // If accessing root, redirect to Arabic locale
    if (pathname === '/') {
      const url = req.nextUrl.clone()
      url.pathname = '/ar'
      return NextResponse.redirect(url)
    }
    
    // If not already under /ar and not a special route, redirect to /ar
    if (!pathname.startsWith('/ar') && pathname !== '/favicon.ico') {
      const url = req.nextUrl.clone()
      url.pathname = `/ar${pathname}`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
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