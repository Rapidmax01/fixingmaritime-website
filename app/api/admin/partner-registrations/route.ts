import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAdminFromRequest } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if database is available
    if (!prisma) {
      // Return empty array in demo mode
      return NextResponse.json({
        success: true,
        registrations: [],
        demoMode: true
      })
    }

    // Get all partner registrations, ordered by creation date (newest first)
    const registrations = await prisma.partnerRegistration.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      registrations: registrations
    })

  } catch (error) {
    console.error('Error fetching partner registrations:', error)
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