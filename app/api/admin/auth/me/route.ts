import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request)

  if (!admin) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    user: admin
  })
}