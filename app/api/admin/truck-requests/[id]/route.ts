import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
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
    const validStatuses = ['pending', 'quoted', 'confirmed', 'assigned', 'in_transit', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      )
    }

    // Update the truck request
    const updatedRequest = await prisma.truckRequest.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      request: updatedRequest
    })

  } catch (error) {
    console.error('Error updating truck request:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Truck request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update truck request' },
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

    // Get single truck request
    const truckRequest = await prisma.truckRequest.findUnique({
      where: { id }
    })

    if (!truckRequest) {
      return NextResponse.json(
        { error: 'Truck request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      request: truckRequest
    })

  } catch (error) {
    console.error('Error fetching truck request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch truck request' },
      { status: 500 }
    )
  }
}