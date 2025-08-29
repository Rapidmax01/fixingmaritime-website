import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    if (!prisma) {
      // Return error if database not available
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 })
    }

    // Fetch real data from database
    const [
      totalUsers,
      newUsers,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalRevenue,
      truckRequests,
      truckRegistrations,
      partnerRegistrations,
      quoteRequests,
      acceptedQuotes,
      services
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // New users in time range
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Total invoices
      prisma.invoice.count(),
      
      // Paid invoices
      prisma.invoice.count({
        where: { status: 'paid' }
      }),
      
      // Pending invoices
      prisma.invoice.count({
        where: { status: 'pending' }
      }),
      
      // Total revenue from paid invoices
      prisma.invoice.aggregate({
        where: { status: 'paid' },
        _sum: { total: true }
      }),
      
      // Truck requests
      prisma.truckRequest.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Truck registrations
      prisma.truckRegistration.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Partner registrations
      prisma.partnerRegistration.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Quote requests
      prisma.quoteRequest.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Accepted quotes
      prisma.quoteRequest.count({
        where: {
          status: 'accepted',
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Active services
      prisma.service.count({
        where: { active: true }
      })
    ])

    // Calculate monthly data for charts
    const monthlyData = await getMonthlyData(startDate, now)
    
    // Get top services by quote requests
    const topServices = await prisma.quoteRequest.groupBy({
      by: ['serviceName'],
      _count: {
        id: true
      },
      _sum: {
        quotedAmount: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 7
    })

    // Get recent activities
    const recentActivities = await getRecentActivities()

    // Get page visit analytics (will use demo data until PageVisit model is deployed)
    const pageVisitStats = getDemoPageVisitStats()

    const conversionRate = quoteRequests > 0 ? ((acceptedQuotes / quoteRequests) * 100).toFixed(1) : '0'
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue: totalRevenue._sum.total || 0,
          totalUsers,
          newUsers,
          ordersCompleted: paidInvoices,
          conversionRate: parseFloat(conversionRate),
          totalInvoices,
          pendingInvoices,
          truckRequests,
          truckRegistrations,
          partnerRegistrations,
          quoteRequests,
          acceptedQuotes,
          activeServices: services
        },
        monthlyData,
        topServices: topServices.map(service => ({
          name: service.serviceName,
          orders: service._count.id,
          revenue: Number(service._sum.quotedAmount || 0)
        })),
        recentActivities,
        pageVisits: pageVisitStats
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    
    // Return error instead of demo data
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

async function getMonthlyData(startDate: Date, endDate: Date) {
  if (!prisma) return []
  
  try {
    // Get invoices grouped by month
    const invoices = await prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        createdAt: true,
        total: true,
        status: true
      }
    })

    // Group by month
    const monthlyMap = new Map()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    invoices.forEach(invoice => {
      const month = months[invoice.createdAt.getMonth()]
      const year = invoice.createdAt.getFullYear()
      const key = `${month} ${year}`
      
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: key,
          revenue: 0,
          orders: 0
        })
      }
      
      const data = monthlyMap.get(key)
      if (invoice.status === 'paid') {
        data.revenue += Number(invoice.total)
      }
      data.orders += 1
    })

    return Array.from(monthlyMap.values())
  } catch (error) {
    console.error('Error getting monthly data:', error)
    return []
  }
}

async function getRecentActivities() {
  if (!prisma) return []
  
  try {
    const activities: Array<{
      type: string
      title: string
      description: string
      timestamp: Date
      icon: string
    }> = []
    
    // Get recent truck requests
    const recentTruckRequests = await prisma.truckRequest.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        createdAt: true,
        serviceType: true
      }
    })
    
    recentTruckRequests.forEach(req => {
      activities.push({
        type: 'truck_request',
        title: 'New truck request',
        description: `${req.companyName} requested ${req.serviceType} service`,
        timestamp: req.createdAt,
        icon: 'Truck'
      })
    })
    
    // Get recent registrations
    const recentRegistrations = await prisma.truckRegistration.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ownerName: true,
        companyName: true,
        createdAt: true
      }
    })
    
    recentRegistrations.forEach(reg => {
      activities.push({
        type: 'registration',
        title: 'New truck registration',
        description: `${reg.ownerName} from ${reg.companyName}`,
        timestamp: reg.createdAt,
        icon: 'UserPlus'
      })
    })
    
    // Sort by timestamp
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    return activities.slice(0, 5)
  } catch (error) {
    console.error('Error getting recent activities:', error)
    return []
  }
}


function getDemoPageVisitStats() {
  return {
    totalVisits: 12543,
    uniqueVisitors: 4321,
    avgDuration: 145,
    topPages: [
      { page: 'Home', visits: 3456, avgDuration: 120 },
      { page: 'Services', visits: 2134, avgDuration: 180 },
      { page: 'Contact', visits: 1567, avgDuration: 90 },
      { page: 'About Us', visits: 987, avgDuration: 150 },
      { page: 'Request Quote', visits: 654, avgDuration: 240 }
    ],
    deviceBreakdown: {
      Desktop: 7890,
      Mobile: 4653
    },
    browserBreakdown: {
      Chrome: 6543,
      Safari: 3210,
      Firefox: 1890,
      Edge: 900
    },
    dailyVisits: [
      { date: '2024-08-20', visits: 423 },
      { date: '2024-08-21', visits: 512 },
      { date: '2024-08-22', visits: 489 },
      { date: '2024-08-23', visits: 567 },
      { date: '2024-08-24', visits: 345 },
      { date: '2024-08-25', visits: 298 },
      { date: '2024-08-26', visits: 634 }
    ]
  }
}

