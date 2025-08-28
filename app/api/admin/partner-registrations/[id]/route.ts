import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAdminFromRequest } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if database is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      )
    }

    // Update the partner registration
    const updatedRegistration = await prisma.partnerRegistration.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      registration: updatedRegistration
    })

  } catch (error) {
    console.error('Error updating partner registration:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Partner registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update partner registration' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if database is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      )
    }

    const { id } = params

    // Get single partner registration
    const partnerRegistration = await prisma.partnerRegistration.findUnique({
      where: { id }
    })

    if (!partnerRegistration) {
      return NextResponse.json(
        { error: 'Partner registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      registration: partnerRegistration
    })

  } catch (error) {
    console.error('Error fetching partner registration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partner registration' },
      { status: 500 }
    )
  }
}