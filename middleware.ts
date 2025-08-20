import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow access to all routes for now
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicPaths = ['/', '/login', '/signup', '/about', '/services', '/contact', '/track']
        const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))
        
        // Allow access to API routes
        if (req.nextUrl.pathname.startsWith('/api')) {
          return true
        }
        
        // Allow access to static files and images
        if (req.nextUrl.pathname.includes('.') || req.nextUrl.pathname.startsWith('/_next')) {
          return true
        }
        
        // Protected routes require authentication
        const protectedPaths = ['/dashboard', '/orders', '/account']
        const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
        
        if (isProtectedPath) {
          return !!token
        }
        
        // Allow all other routes
        return true
      }
    },
    pages: {
      signIn: '/login',
      error: '/login',
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}