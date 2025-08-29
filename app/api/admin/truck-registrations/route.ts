import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!prisma) {
      // Return empty array in demo mode
      return NextResponse.json({
        success: true,
        registrations: [],
        demoMode: true
      })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    
    // Build where clause
    const whereClause: any = {}
    if (status && status !== 'all') {
      whereClause.status = status
    }

    // Get truck registrations with pagination, ordered by creation date (newest first)
    const registrations = await prisma.truckRegistration.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      success: true,
      registrations: registrations
    })

  } catch (error) {
    console.error('Error fetching truck registrations:', error)
    // Return empty array in case of database connection issues
    return NextResponse.json({
      success: true,
      registrations: [],
      demoMode: true,
      error: 'Database connection unavailable - running in demo mode'
    })
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}