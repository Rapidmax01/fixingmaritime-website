import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

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

    const userEmail = session.user.email!
    const userId = (session.user as any)?.id

    try {
      // Get user's statistics in parallel
      const [
        activeOrders,
        completedOrders,
        totalSpent,
        shipmentsInTransit,
        recentOrders
      ] = await Promise.all([
        // Active orders (not completed, delivered, or cancelled)
        prisma.order?.count({
          where: {
            OR: [
              ...(userId ? [{ userId: userId }] : []),
              { customerEmail: userEmail }
            ],
            status: {
              notIn: ['delivered', 'cancelled']
            }
          }
        }).catch(() => 0) || Promise.resolve(0),
        
        // Completed orders
        prisma.order?.count({
          where: {
            OR: [
              ...(userId ? [{ userId: userId }] : []),
              { customerEmail: userEmail }
            ],
            status: 'delivered'
          }
        }).catch(() => 0) || Promise.resolve(0),
        
        // Total spent (sum of all paid orders)
        prisma.order?.aggregate({
          where: {
            OR: [
              ...(userId ? [{ userId: userId }] : []),
              { customerEmail: userEmail }
            ],
            paymentStatus: 'paid'
          },
          _sum: {
            amount: true
          }
        }).then(result => result._sum.amount || 0).catch(() => 0) || Promise.resolve(0),
        
        // Shipments in transit
        prisma.order?.count({
          where: {
            OR: [
              ...(userId ? [{ userId: userId }] : []),
              { customerEmail: userEmail }
            ],
            status: 'in_transit'
          }
        }).catch(() => 0) || Promise.resolve(0),
        
        // Recent orders for the orders list
        prisma.order?.findMany({
          where: {
            OR: [
              ...(userId ? [{ userId: userId }] : []),
              { customerEmail: userEmail }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }).catch(() => []) || Promise.resolve([])
      ])

      // Format total spent as currency
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(amount)
      }

      // Build stats object
      const stats = [
        {
          name: 'Active Orders',
          value: activeOrders.toString(),
          change: '+0%', // Could calculate this based on previous period if needed
          changeType: 'neutral',
          icon: 'Package',
        },
        {
          name: 'Total Spent',
          value: formatCurrency(Number(totalSpent)),
          change: '+0%',
          changeType: 'neutral',
          icon: 'DollarSign',
        },
        {
          name: 'Completed Orders',
          value: completedOrders.toString(),
          change: '+0%',
          changeType: 'positive',
          icon: 'CheckCircle',
        },
        {
          name: 'Shipments In Transit',
          value: shipmentsInTransit.toString(),
          change: '+0%',
          changeType: 'neutral',
          icon: 'Ship',
        }
      ]

      // Format recent orders
      const formattedOrders = recentOrders.map(order => ({
        id: order.orderNumber,
        service: order.serviceName,
        status: order.status,
        amount: Number(order.amount),
        date: order.createdAt.toISOString().split('T')[0],
        trackingNumber: order.trackingNumber,
      }))

      return NextResponse.json({
        success: true,
        stats,
        orders: formattedOrders
      })

    } catch (dbError: any) {
      console.error('Database error fetching dashboard stats:', dbError)
      
      // Return fallback stats if database tables don't exist
      const fallbackStats = [
        {
          name: 'Active Orders',
          value: '0',
          change: '+0%',
          changeType: 'neutral',
          icon: 'Package',
        },
        {
          name: 'Total Spent',
          value: '$0.00',
          change: '+0%',
          changeType: 'neutral',
          icon: 'DollarSign',
        },
        {
          name: 'Completed Orders',
          value: '0',
          change: '+0%',
          changeType: 'neutral',
          icon: 'CheckCircle',
        },
        {
          name: 'Shipments In Transit',
          value: '0',
          change: '+0%',
          changeType: 'neutral',
          icon: 'Ship',
        }
      ]

      return NextResponse.json({
        success: true,
        stats: fallbackStats,
        orders: [],
        message: 'Database not fully initialized'
      })
    }

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 })
  }
}