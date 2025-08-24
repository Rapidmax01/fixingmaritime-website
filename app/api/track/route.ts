import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

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

    // Try to find in orders first
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { trackingNumber: trackingNumber },
          { orderNumber: trackingNumber }
        ]
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        orderItems: {
          include: {
            service: true
          }
        },
        tracking: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (order) {
      return NextResponse.json({
        success: true,
        data: {
          type: 'order',
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber,
          service: order.orderItems[0]?.service?.name || 'Maritime Service',
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          customer: order.user.name,
          events: order.tracking.map((track, index) => ({
            id: track.id,
            status: track.status,
            location: track.location || 'Processing Center',
            timestamp: track.createdAt,
            description: track.description || `Order ${track.status}`,
            icon: getIconForStatus(track.status)
          }))
        }
      })
    }

    // Try to find in truck requests
    const truckRequest = await prisma.truckRequest.findFirst({
      where: {
        OR: [
          { trackingNumber: trackingNumber },
          { id: trackingNumber }
        ]
      }
    })

    if (truckRequest) {
      return NextResponse.json({
        success: true,
        data: {
          type: 'truck_request',
          orderNumber: `TR-${truckRequest.id.slice(-8)}`,
          trackingNumber: truckRequest.trackingNumber || truckRequest.id,
          service: 'Truck Transportation',
          status: truckRequest.status,
          createdAt: truckRequest.createdAt,
          updatedAt: truckRequest.updatedAt,
          customer: truckRequest.companyName,
          pickupAddress: truckRequest.pickupAddress,
          deliveryAddress: truckRequest.deliveryAddress,
          cargoType: truckRequest.cargoType,
          events: generateTruckRequestEvents(truckRequest)
        }
      })
    }

    // If not found in database, try mock data
    const mockResponse = getMockTrackingData(trackingNumber)
    if (mockResponse) {
      return mockResponse
    }

    return NextResponse.json(
      { error: 'Tracking number not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error fetching tracking data:', error)
    
    // Fall back to mock data on error
    const { searchParams } = new URL(request.url)
    const trackingNumber = searchParams.get('tracking') || ''
    const mockResponse = getMockTrackingData(trackingNumber)
    if (mockResponse) {
      return mockResponse
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getIconForStatus(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Package'
    case 'processing':
      return 'Clock'
    case 'in_transit':
      return 'Truck'
    case 'delivered':
    case 'completed':
      return 'CheckCircle'
    case 'cancelled':
      return 'XCircle'
    default:
      return 'Package'
  }
}

function generateTruckRequestEvents(request: any) {
  const events = []
  const baseTime = new Date(request.createdAt)

  // Request placed
  events.push({
    id: '1',
    status: 'Request Submitted',
    location: 'Customer Portal',
    timestamp: request.createdAt,
    description: `Truck request submitted for pickup from ${request.pickupAddress}`,
    icon: 'Package'
  })

  // If not pending, add more events
  if (request.status !== 'pending') {
    events.push({
      id: '2',
      status: 'Request Reviewed',
      location: 'Operations Center',
      timestamp: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000), // +2 hours
      description: 'Request has been reviewed and approved by operations team',
      icon: 'CheckCircle'
    })

    if (request.status === 'confirmed' || request.status === 'assigned' || request.status === 'in_transit' || request.status === 'delivered') {
      events.push({
        id: '3',
        status: 'Truck Assigned',
        location: 'Dispatch Center',
        timestamp: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000), // +4 hours
        description: `Truck assigned${request.assignedDriver ? ` to driver ${request.assignedDriver}` : ''}`,
        icon: 'Truck'
      })
    }

    if (request.status === 'in_transit' || request.status === 'delivered') {
      events.push({
        id: '4',
        status: 'En Route to Pickup',
        location: request.pickupAddress.split(',')[0], // First part of address
        timestamp: new Date(baseTime.getTime() + 6 * 60 * 60 * 1000), // +6 hours
        description: 'Truck is en route to pickup location',
        icon: 'Truck'
      })

      events.push({
        id: '5',
        status: 'Cargo Loaded',
        location: request.pickupAddress,
        timestamp: new Date(baseTime.getTime() + 8 * 60 * 60 * 1000), // +8 hours
        description: `${request.cargoType} cargo loaded and secured`,
        icon: 'Package'
      })

      events.push({
        id: '6',
        status: 'In Transit',
        location: 'En Route',
        timestamp: new Date(baseTime.getTime() + 9 * 60 * 60 * 1000), // +9 hours
        description: `Truck is in transit to ${request.deliveryAddress}`,
        icon: 'Truck'
      })
    }

    if (request.status === 'delivered') {
      events.push({
        id: '7',
        status: 'Delivered',
        location: request.deliveryAddress,
        timestamp: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000), // +12 hours
        description: 'Cargo successfully delivered to destination',
        icon: 'CheckCircle'
      })
    }
  }

  return events
}

function getMockTrackingData(trackingNumber: string): NextResponse | null {
  const mockTrackingData: { [key: string]: any } = {
    'TRK-DOC-001': {
      type: 'order',
      orderNumber: 'ORD-2024-001',
      trackingNumber: 'TRK-DOC-001',
      service: 'Documentation Services',
      status: 'completed',
      estimatedDelivery: '2024-08-15',
      currentLocation: 'Delivered',
      events: [
        {
          id: '1',
          status: 'Order Placed',
          location: 'Customer Portal',
          timestamp: '2024-08-12T09:00:00Z',
          description: 'Documentation service order has been placed and confirmed.',
          icon: 'Package',
        },
        {
          id: '2',
          status: 'Processing Started',
          location: 'Documentation Center',
          timestamp: '2024-08-12T14:30:00Z',
          description: 'Our team has started processing your documents.',
          icon: 'Clock',
        },
        {
          id: '3',
          status: 'Documents Prepared',
          location: 'Quality Control',
          timestamp: '2024-08-14T11:00:00Z',
          description: 'All documents have been prepared and are undergoing quality review.',
          icon: 'CheckCircle',
        },
        {
          id: '4',
          status: 'Completed',
          location: 'Digital Delivery',
          timestamp: '2024-08-15T16:45:00Z',
          description: 'Documents have been delivered digitally to your email.',
          icon: 'CheckCircle',
        },
      ],
    },
    'TRK-FRT-002': {
      type: 'order',
      orderNumber: 'ORD-2024-002',
      trackingNumber: 'TRK-FRT-002',
      service: 'Freight Forwarding',
      status: 'in_transit',
      estimatedDelivery: '2024-08-25',
      currentLocation: 'Pacific Ocean - En Route to Los Angeles',
      events: [
        {
          id: '1',
          status: 'Order Confirmed',
          location: 'Singapore Port',
          timestamp: '2024-08-18T08:00:00Z',
          description: 'Freight forwarding order confirmed and cargo received.',
          icon: 'Package',
        },
        {
          id: '2',
          status: 'Loaded on Vessel',
          location: 'Singapore Port Terminal 3',
          timestamp: '2024-08-19T15:30:00Z',
          description: 'Container loaded onto vessel MV Pacific Star.',
          icon: 'Ship',
        },
        {
          id: '3',
          status: 'Departed Singapore',
          location: 'Singapore Strait',
          timestamp: '2024-08-19T22:00:00Z',
          description: 'Vessel has departed Singapore and is en route to Los Angeles.',
          icon: 'Ship',
        },
        {
          id: '4',
          status: 'In Transit',
          location: 'Pacific Ocean',
          timestamp: '2024-08-20T12:00:00Z',
          description: 'Currently sailing across the Pacific Ocean. ETA: August 25th.',
          icon: 'Ship',
        },
      ],
    },
    'TRK-WHS-003': {
      type: 'order',
      orderNumber: 'ORD-2024-003',
      trackingNumber: 'TRK-WHS-003',
      service: 'Warehousing',
      status: 'processing',
      estimatedDelivery: 'Ongoing Storage',
      currentLocation: 'Warehouse Facility A-12',
      events: [
        {
          id: '1',
          status: 'Goods Received',
          location: 'Warehouse Reception',
          timestamp: '2024-08-20T10:00:00Z',
          description: 'Your goods have been received and checked into our warehouse.',
          icon: 'Package',
        },
        {
          id: '2',
          status: 'Storage Allocated',
          location: 'Warehouse Section A-12',
          timestamp: '2024-08-20T14:00:00Z',
          description: 'Storage space has been allocated in climate-controlled section.',
          icon: 'CheckCircle',
        },
      ],
    },
  }

  const data = mockTrackingData[trackingNumber]
  if (data) {
    return NextResponse.json({
      success: true,
      data: data
    })
  }

  return null
}