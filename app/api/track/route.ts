import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingNumber = searchParams.get('tracking')

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!prisma) {
      // Fall back to mock data when database is unavailable
      const mockResponse = getMockTrackingData(trackingNumber)
      if (mockResponse) {
        return mockResponse
      }
      return NextResponse.json(
        { error: 'Tracking number not found' },
        { status: 404 }
      )
    }

    // Try to find in truck requests first
    let truckRequest = null
    try {
      truckRequest = await prisma.truckRequest.findFirst({
        where: {
          OR: [
            { trackingNumber: trackingNumber },
            { id: trackingNumber }
          ]
        }
      })
    } catch (dbError) {
      console.error('Error querying truck requests:', dbError)
    }

    if (truckRequest) {
      return NextResponse.json({
        success: true,
        data: {
          type: 'truck_request',
          id: truckRequest.id,
          trackingNumber: truckRequest.trackingNumber || truckRequest.id,
          service: 'Truck Services',
          status: truckRequest.status,
          quote: truckRequest.quote,
          createdAt: truckRequest.createdAt,
          updatedAt: truckRequest.updatedAt,
          customer: truckRequest.contactName,
          company: truckRequest.companyName,
          pickup: {
            address: truckRequest.pickupAddress,
            city: truckRequest.pickupCity,
            date: truckRequest.pickupDate
          },
          delivery: {
            address: truckRequest.deliveryAddress,
            city: truckRequest.deliveryCity,
            date: truckRequest.deliveryDate
          },
          cargo: {
            type: truckRequest.cargoType,
            weight: truckRequest.cargoWeight,
            value: truckRequest.cargoValue
          },
          events: generateTrackingEvents(truckRequest.status, truckRequest.createdAt, truckRequest.updatedAt)
        }
      })
    }

    // If no results found, return error
    return NextResponse.json(
      { error: 'Tracking number not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error fetching tracking data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateTrackingEvents(status: string, createdAt: Date, updatedAt: Date) {
  const events = []
  
  events.push({
    id: '1',
    status: 'pending',
    location: 'Request Received',
    timestamp: createdAt,
    description: 'Your request has been received and is being processed',
    icon: 'Clock'
  })

  if (status !== 'pending') {
    events.push({
      id: '2',
      status: 'quoted',
      location: 'Quote Prepared',
      timestamp: updatedAt,
      description: 'Quote has been prepared and sent',
      icon: 'DollarSign'
    })
  }

  if (status === 'confirmed' || status === 'assigned' || status === 'in_transit' || status === 'delivered') {
    events.push({
      id: '3',
      status: 'confirmed',
      location: 'Booking Confirmed',
      timestamp: updatedAt,
      description: 'Your booking has been confirmed',
      icon: 'CheckCircle'
    })
  }

  if (status === 'assigned' || status === 'in_transit' || status === 'delivered') {
    events.push({
      id: '4',
      status: 'assigned',
      location: 'Driver Assigned',
      timestamp: updatedAt,
      description: 'A driver has been assigned to your request',
      icon: 'Truck'
    })
  }

  if (status === 'in_transit') {
    events.push({
      id: '5',
      status: 'in_transit',
      location: 'In Transit',
      timestamp: updatedAt,
      description: 'Your cargo is in transit',
      icon: 'Navigation'
    })
  }

  if (status === 'delivered') {
    events.push({
      id: '6',
      status: 'delivered',
      location: 'Delivered',
      timestamp: updatedAt,
      description: 'Your cargo has been delivered successfully',
      icon: 'CheckCircle2'
    })
  }

  return events
}

function getMockTrackingData(trackingNumber: string): NextResponse | null {
  // Mock tracking data for demo purposes
  const mockData = {
    'DEMO001': {
      type: 'truck_request',
      id: 'DEMO001',
      trackingNumber: 'DEMO001',
      service: 'Truck Services',
      status: 'in_transit',
      createdAt: new Date('2024-08-20T10:00:00Z'),
      updatedAt: new Date('2024-08-22T14:30:00Z'),
      customer: 'John Doe',
      company: 'Demo Company',
      pickup: {
        address: '123 Main St, Lagos',
        city: 'Lagos',
        date: new Date('2024-08-21T08:00:00Z')
      },
      delivery: {
        address: '456 Industrial Ave, Abuja',
        city: 'Abuja',
        date: new Date('2024-08-23T16:00:00Z')
      },
      cargo: {
        type: 'Electronics',
        weight: '500kg',
        value: '₦2,000,000'
      },
      events: [
        {
          id: '1',
          status: 'pending',
          location: 'Request Received',
          timestamp: new Date('2024-08-20T10:00:00Z'),
          description: 'Your request has been received',
          icon: 'Clock'
        },
        {
          id: '2',
          status: 'confirmed',
          location: 'Lagos Depot',
          timestamp: new Date('2024-08-21T08:00:00Z'),
          description: 'Pickup confirmed',
          icon: 'CheckCircle'
        },
        {
          id: '3',
          status: 'in_transit',
          location: 'En Route',
          timestamp: new Date('2024-08-22T14:30:00Z'),
          description: 'Package in transit to Abuja',
          icon: 'Navigation'
        }
      ]
    }
  }

  if (mockData[trackingNumber as keyof typeof mockData]) {
    return NextResponse.json({
      success: true,
      data: mockData[trackingNumber as keyof typeof mockData]
    })
  }

  return null
}