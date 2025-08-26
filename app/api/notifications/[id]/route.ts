import { NextRequest, NextResponse } from 'next/server'
import { markNotificationAsRead } from '@/lib/notification-service'

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { email, action } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (action === 'mark_read') {
      const result = await markNotificationAsRead(params.id, email)
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json({ 
        success: true, 
        notification: result.notification 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ 
      error: 'Failed to update notification' 
    }, { status: 500 })
  }
}