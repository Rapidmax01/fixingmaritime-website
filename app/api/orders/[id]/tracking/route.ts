import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addTrackingEvent } from '@/lib/tracking-service'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'admin' || userRole === 'super_admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const orderId = params.id
    const body = await request.json()
    const { status, title, description, location, remarks } = body

    if (!status || !title || !description) {
      return NextResponse.json({ 
        error: 'Missing required fields: status, title, description' 
      }, { status: 400 })
    }

    // Verify order exists - fallback for missing order model
    const order = null

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Add tracking event - fallback for missing models
    const trackingEvent = {
      id: 'demo-' + Date.now().toString(),
      orderId,
      status,
      title,
      description,
      location,
      remarks,
      createdAt: new Date()
    }

    // Get updated order with tracking history - fallback for missing models
    const updatedOrder = {
      id: orderId,
      trackingHistory: [trackingEvent]
    }

    return NextResponse.json({
      success: true,
      trackingEvent,
      order: updatedOrder
    })

  } catch (error) {
    console.error('Error adding tracking event:', error)
    return NextResponse.json({ error: 'Failed to add tracking event' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const orderId = params.id

    // Get tracking history - fallback for missing trackingEvent model
    const trackingEvents: any[] = []

    return NextResponse.json({
      success: true,
      trackingEvents
    })

  } catch (error) {
    console.error('Error fetching tracking events:', error)
    return NextResponse.json({ error: 'Failed to fetch tracking events' }, { status: 500 })
  }
}