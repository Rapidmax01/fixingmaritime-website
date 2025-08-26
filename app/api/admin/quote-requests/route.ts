import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const serviceId = searchParams.get('serviceId')

    const skip = (page - 1) * limit

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (serviceId && serviceId !== 'all') where.serviceId = serviceId

    let quoteRequests: any[] = []
    let totalCount = 0
    let statusCounts: any[] = []

    try {
      const results = await Promise.all([
        prisma.quoteRequest.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.quoteRequest.count({ where }),
        prisma.quoteRequest.groupBy({
          by: ['status'],
          _count: { status: true }
        })
      ])
      
      quoteRequests = results[0]
      totalCount = results[1]
      statusCounts = results[2]
    } catch (dbError: any) {
      console.error('Database error in admin quotes:', dbError)
      
      // If table doesn't exist, return empty results
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        console.log('QuoteRequest table not yet created - returning empty results')
        quoteRequests = []
        totalCount = 0
        statusCounts = []
      } else {
        throw dbError
      }
    }

    // Format status counts for easy access
    const statusSummary = {
      pending: 0,
      quoted: 0,
      accepted: 0,
      rejected: 0,
      completed: 0
    }

    statusCounts.forEach((count) => {
      if (count.status in statusSummary) {
        statusSummary[count.status as keyof typeof statusSummary] = count._count.status
      }
    })

    return NextResponse.json({
      quoteRequests,
      statusSummary,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching admin quote requests:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch quote requests' 
    }, { status: 500 })
  }
}