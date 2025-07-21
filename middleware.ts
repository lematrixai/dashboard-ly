import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/',
  '/destinations',
  '/bookings',
  '/posts',
  '/users',
]

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  try {
    // Get the user data from cookies
    const userData = request.cookies.get('auth-user')?.value
    const isAuthenticated = !!userData

    // Check if the route is protected (but not auth routes)
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Check if the route is an auth route
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    )

    // If it's an auth route, handle authentication redirects
    if (isAuthRoute) {
      // Redirect to dashboard if accessing auth routes while authenticated
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      // If not authenticated, allow access to auth routes
      return NextResponse.next()
    }

    // For non-auth routes, check if they're protected
    if (isProtectedRoute && !isAuthenticated) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Continue with the request
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 