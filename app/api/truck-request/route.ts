import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'companyName', 'contactName', 'email', 'phoneNumber',
      'pickupAddress', 'pickupDate', 'pickupTime',
      'deliveryAddress', 'deliveryDate', 'deliveryTime',
      'cargoType', 'cargoWeight', 'cargoValue',
      'serviceType', 'urgency'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create truck request in database
    const truckRequest = await prisma.truckRequest.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        pickupAddress: body.pickupAddress,
        pickupCity: body.pickupCity,
        pickupDate: new Date(body.pickupDate + 'T' + body.pickupTime),
        deliveryAddress: body.deliveryAddress,
        deliveryCity: body.deliveryCity,
        deliveryDate: new Date(body.deliveryDate + 'T' + body.deliveryTime),
        cargoType: body.cargoType,
        cargoWeight: body.cargoWeight,
        cargoValue: body.cargoValue,
        specialInstructions: body.specialInstructions || '',
        serviceType: body.serviceType,
        urgency: body.urgency,
        status: 'pending'
      }
    })

    console.log('Truck request created:', truckRequest.id)

    return NextResponse.json({
      message: 'Truck request submitted successfully',
      requestId: truckRequest.id
    })

  } catch (error) {
    console.error('Error creating truck request:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Truck request API endpoint' })
}