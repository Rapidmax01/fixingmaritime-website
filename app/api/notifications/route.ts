import { NextRequest, NextResponse } from 'next/server'
import { getNotifications, getUnreadNotificationCount } from '@/lib/notification-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const countOnly = searchParams.get('count') === 'true'

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (countOnly) {
      const { count } = await getUnreadNotificationCount(email)
      return NextResponse.json({ unreadCount: count })
    }

    const { notifications, totalCount } = await getNotifications(email, limit, offset)

    return NextResponse.json({
      notifications,
      pagination: {
        limit,
        offset,
        totalCount,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch notifications' 
    }, { status: 500 })
  }
}