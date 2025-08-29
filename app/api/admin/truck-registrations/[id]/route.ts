import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if database is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { status, reviewNotes, reviewedBy } = body

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      )
    }

    // Update the truck registration
    const updatedRegistration = await prisma.truckRegistration.update({
      where: { id },
      data: { 
        status,
        reviewNotes: reviewNotes || null,
        reviewedBy: reviewedBy || null,
        reviewedAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      registration: updatedRegistration
    })

  } catch (error) {
    console.error('Error updating truck registration:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Truck registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update truck registration' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if database is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      )
    }

    const { id } = params

    // Get single truck registration
    const truckRegistration = await prisma.truckRegistration.findUnique({
      where: { id }
    })

    if (!truckRegistration) {
      return NextResponse.json(
        { error: 'Truck registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      registration: truckRegistration
    })

  } catch (error) {
    console.error('Error fetching truck registration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch truck registration' },
      { status: 500 }
    )
  }
}