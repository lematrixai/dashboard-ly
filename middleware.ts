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
  '/forgot-password',
  '/reset-password',
]

// Define admin-only routes
const adminRoutes = [
  '/sign-up',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  try {
    // Get the user data from cookies
    const userData = request.cookies.get('auth-user')?.value
    const isAuthenticated = !!userData

    console.log(`Middleware: ${pathname} - Auth: ${isAuthenticated ? 'Yes' : 'No'}`)

    // Check if the route is protected (but not auth routes)
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Check if the route is an auth route
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Check if the route is an admin route
    const isAdminRoute = adminRoutes.some(route => 
      pathname.startsWith(route)
    )

    // If it's an auth route, handle authentication redirects
    if (isAuthRoute) {
      // Redirect to dashboard if accessing auth routes while authenticated
      if (isAuthenticated) {
        console.log(`Middleware: Redirecting authenticated user from ${pathname} to /`)
        return NextResponse.redirect(new URL('/', request.url))
      }
      // If not authenticated, allow access to auth routes
      return NextResponse.next()
    }

    // If it's an admin route, block access (signup is now admin-only)
    if (isAdminRoute) {
      console.log(`Middleware: Blocking access to admin route ${pathname}`)
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // For non-auth routes, check if they're protected
    if (isProtectedRoute && !isAuthenticated) {
      console.log(`Middleware: Redirecting unauthenticated user from ${pathname} to /sign-in`)
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Continue with the request
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to sign-in for safety
    return NextResponse.redirect(new URL('/sign-in', request.url))
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