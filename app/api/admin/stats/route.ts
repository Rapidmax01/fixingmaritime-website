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
    const userRole = (session?.user as any)?.role
    const isAdmin = userRole === 'admin' || userRole === 'super_admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get current date ranges
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    try {
      // Get stats in parallel
      const [
        totalUsers,
        totalUsersLastMonth,
        totalQuotes,
        totalQuotesLastMonth,
        pendingQuotes,
        activeServices,
        totalOrders,
        recentQuotes
      ] = await Promise.all([
        // Total users
        prisma.user.count(),
        
        // Users from last month (for comparison)
        prisma.user.count({
          where: {
            createdAt: {
              gte: startOfLastMonth,
              lte: endOfLastMonth
            }
          }
        }),
        
        // Total quote requests
        prisma.quoteRequest.count(),
        
        // Quote requests from last month
        prisma.quoteRequest.count({
          where: {
            createdAt: {
              gte: startOfLastMonth,
              lte: endOfLastMonth
            }
          }
        }),
        
        // Pending quotes
        prisma.quoteRequest.count({
          where: {
            status: 'pending'
          }
        }),
        
        // Active services
        prisma.service.count({
          where: {
            active: true
          }
        }),
        
        // Total orders (if available)
        prisma.order?.count().catch(() => 0) || Promise.resolve(0),
        
        // Recent quote requests for activity feed
        prisma.quoteRequest.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            // Include service name if available
          }
        })
      ])

      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? '+100%' : '0%'
        const change = ((current - previous) / previous) * 100
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
      }

      // Build stats object
      const stats = [
        {
          name: 'Total Users',
          value: totalUsers.toString(),
          change: calculateChange(totalUsers, totalUsersLastMonth),
          changeType: totalUsers >= totalUsersLastMonth ? 'positive' : 'negative',
          icon: 'Users',
          color: 'bg-blue-500'
        },
        {
          name: 'Quote Requests',
          value: totalQuotes.toString(),
          change: calculateChange(totalQuotes, totalQuotesLastMonth),
          changeType: totalQuotes >= totalQuotesLastMonth ? 'positive' : 'negative',
          icon: 'Package',
          color: 'bg-green-500'
        },
        {
          name: 'Pending Quotes',
          value: pendingQuotes.toString(),
          change: '0%', // Could calculate this based on trend if needed
          changeType: 'neutral',
          icon: 'DollarSign',
          color: 'bg-purple-500'
        },
        {
          name: 'Services Active',
          value: activeServices.toString(),
          change: '0%', // Services don't change frequently
          changeType: 'neutral',
          icon: 'Ship',
          color: 'bg-orange-500'
        }
      ]

      // Build recent activity from quote requests
      const recentActivity = recentQuotes.map((quote, index) => ({
        id: quote.id,
        type: 'quote',
        message: `New quote request for ${quote.serviceName} from ${quote.company || quote.name}`,
        time: getTimeAgo(quote.createdAt),
        status: quote.status === 'pending' ? 'new' : quote.status
      }))

      return NextResponse.json({
        success: true,
        stats,
        recentActivity
      })

    } catch (dbError: any) {
      console.error('Database error fetching admin stats:', dbError)
      
      // Return fallback stats if database tables don't exist
      const fallbackStats = [
        {
          name: 'Total Users',
          value: '0',
          change: '0%',
          changeType: 'neutral',
          icon: 'Users',
          color: 'bg-blue-500'
        },
        {
          name: 'Quote Requests',
          value: '0',
          change: '0%',
          changeType: 'neutral',
          icon: 'Package',
          color: 'bg-green-500'
        },
        {
          name: 'Pending Quotes',
          value: '0',
          change: '0%',
          changeType: 'neutral',
          icon: 'DollarSign',
          color: 'bg-purple-500'
        },
        {
          name: 'Services Active',
          value: '0',
          change: '0%',
          changeType: 'neutral',
          icon: 'Ship',
          color: 'bg-orange-500'
        }
      ]

      return NextResponse.json({
        success: true,
        stats: fallbackStats,
        recentActivity: [],
        message: 'Database not fully initialized'
      })
    }

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 })
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}