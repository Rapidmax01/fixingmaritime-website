import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if admin token cookie exists
    const token = request.cookies.get('admin-token')?.value
    const cookies = Object.fromEntries(
      request.cookies.getAll().map(cookie => [cookie.name, cookie.value])
    )

    // Try to get current admin user
    const currentUser = getAdminFromRequest(request)

    return NextResponse.json({
      status: 'success',
      authentication: {
        hasToken: !!token,
        tokenPreview: token ? `${token.slice(0, 10)}...${token.slice(-10)}` : null,
        currentUser: currentUser,
        isAuthenticated: !!currentUser,
      },
      cookies: {
        count: Object.keys(cookies).length,
        names: Object.keys(cookies),
        adminToken: !!cookies['admin-token']
      },
      timestamp: new Date().toISOString(),
      headers: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        origin: request.headers.get('origin')
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}