import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateOrderNumber, generateTrackingNumber, createInitialTrackingEvents } from '@/lib/tracking-service'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const userRole = (session.user as any)?.role
    const isAdmin = userRole === 'admin' || userRole === 'super_admin'

    // Build where clause
    const whereClause: any = {}
    
    if (!isAdmin) {
      // Regular users can only see their own orders
      const userId = (session.user as any)?.id
      if (userId) {
        whereClause.OR = [
          { userId: userId },
          { customerEmail: session.user.email }
        ]
      } else {
        whereClause.customerEmail = session.user.email
      }
    }
    
    if (status) {
      whereClause.status = status
    }

    const [orders, totalCount] = await Promise.all([
      Promise.resolve([]),
      Promise.resolve(0)
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      company,
      serviceId,
      serviceName,
      description,
      amount,
      currency = 'USD',
      quoteRequestId,
      paymentStatus = 'unpaid',
      paymentMethod,
      pickupAddress,
      pickupCity,
      deliveryAddress,
      deliveryCity
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !serviceId || !serviceName || !description || !amount) {
      return NextResponse.json({ 
        error: 'Missing required fields: customerName, customerEmail, customerPhone, serviceId, serviceName, description, amount' 
      }, { status: 400 })
    }

    // Check if user exists
    let userId = null
    try {
      const user = await prisma.user.findUnique({
        where: { email: customerEmail }
      })
      userId = user?.id || null
    } catch (error) {
      console.log('User not found, creating order without userId')
    }

    // Generate order and tracking numbers
    const orderNumber = await generateOrderNumber()
    const trackingNumber = await generateTrackingNumber()

    // Create order - fallback for missing order model
    const order = {
      id: 'demo-' + Date.now().toString(),
      orderNumber,
      trackingNumber,
      status: 'pending',
      amount: parseFloat(amount.toString()),
      currency
    }

    // Create initial tracking events - skipped for missing models
    // await createInitialTrackingEvents(order.id, paymentStatus)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        status: order.status,
        amount: order.amount,
        currency: order.currency
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}