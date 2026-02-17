import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only protect specific routes that require auth
        const { pathname } = req.nextUrl
        const protectedRoutes = ['/portfolio', '/leaderboard']
        
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/portfolio/:path*', '/leaderboard/:path*'],
}
