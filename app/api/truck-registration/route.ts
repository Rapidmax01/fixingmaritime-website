import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = process.env.DATABASE_URL ? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}) : null

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        error: 'Database not available' 
      }, { status: 503 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'ownerName', 'email', 'phone', 'address',
      'companyName', 'businessType', 'yearsInBusiness',
      'truckMake', 'truckModel', 'truckYear', 'plateNumber', 'truckType',
      'insuranceProvider', 'insuranceExpiry', 'licenseExpiry',
      'serviceAreas', 'experience'
    ]

    for (const field of requiredFields) {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }

    // Check if email already exists
    const existingRegistration = await prisma.truckRegistration.findFirst({
      where: { 
        OR: [
          { email: data.email },
          { plateNumber: data.plateNumber }
        ]
      }
    })

    if (existingRegistration) {
      return NextResponse.json({ 
        error: 'A truck with this email or plate number is already registered' 
      }, { status: 409 })
    }

    // Create truck registration
    const registration = await prisma.truckRegistration.create({
      data: {
        // Owner Information
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        
        // Business Information
        companyName: data.companyName,
        businessType: data.businessType,
        taxId: data.taxId || null,
        yearsInBusiness: data.yearsInBusiness,
        
        // Truck Information
        truckMake: data.truckMake,
        truckModel: data.truckModel,
        truckYear: parseInt(data.truckYear),
        plateNumber: data.plateNumber,
        vinNumber: data.vinNumber || null,
        truckType: data.truckType,
        capacity: data.capacity || null,
        
        // Insurance & Documents
        insuranceProvider: data.insuranceProvider,
        insuranceExpiry: new Date(data.insuranceExpiry),
        licenseExpiry: new Date(data.licenseExpiry),
        
        // Service Areas & Preferences
        serviceAreas: data.serviceAreas,
        willingToRelocate: data.willingToRelocate || false,
        
        // Experience & Specializations
        experience: data.experience,
        specializations: data.specializations || [],
        additionalNotes: data.additionalNotes || null,
        
        // Status
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // TODO: Send confirmation email to truck owner
    // TODO: Send notification email to admin team

    return NextResponse.json({ 
      message: 'Registration submitted successfully',
      registrationId: registration.id
    }, { status: 201 })

  } catch (error: any) {
    console.error('Truck registration error:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A truck with this information already exists' 
      }, { status: 409 })
    }

    return NextResponse.json({ 
      error: 'Failed to submit registration' 
    }, { status: 500 })
  }
}

// GET endpoint to retrieve registration status (optional)
export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        error: 'Database not available' 
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const registrationId = searchParams.get('id')

    if (!email && !registrationId) {
      return NextResponse.json({ 
        error: 'Email or registration ID required' 
      }, { status: 400 })
    }

    let whereClause
    if (email) {
      whereClause = { email }
    } else if (registrationId) {
      whereClause = { id: registrationId }
    } else {
      return NextResponse.json({ 
        error: 'Email or registration ID required' 
      }, { status: 400 })
    }

    const registration = await prisma.truckRegistration.findFirst({
      where: whereClause,
      select: {
        id: true,
        ownerName: true,
        email: true,
        companyName: true,
        truckMake: true,
        truckModel: true,
        truckYear: true,
        plateNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!registration) {
      return NextResponse.json({ 
        error: 'Registration not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ registration })

  } catch (error: any) {
    console.error('Error fetching registration:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch registration' 
    }, { status: 500 })
  }
}