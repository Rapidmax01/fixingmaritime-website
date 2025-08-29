import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

export const dynamic = 'force-dynamic'

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
      'companyName', 'ownerName', 'email', 'phoneNumber', 'homeAddress', 'officeWarehouseAddress',
      'bankName', 'accountNumber', 'accountName',
      'nextOfKinName', 'nextOfKinRelationship', 'nextOfKinAddress', 'nextOfKinPhone',
      'nationalIdCard', 'utilityBill', 'cacRegistration',
      'agreedToTerms', 'agreedToPrivacy'
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }

    // Check if email already exists
    const existingPartner = await prisma.partnerRegistration.findFirst({
      where: { 
        email: data.email 
      }
    })

    if (existingPartner) {
      return NextResponse.json({ 
        error: 'A partner with this email is already registered' 
      }, { status: 409 })
    }

    // Create partner registration
    const registration = await prisma.partnerRegistration.create({
      data: {
        // Company & Owner Information
        companyName: data.companyName,
        ownerName: data.ownerName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        homeAddress: data.homeAddress,
        officeWarehouseAddress: data.officeWarehouseAddress,
        
        // Bank Account Details
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        
        // Next of Kin Information
        nextOfKinName: data.nextOfKinName,
        nextOfKinRelationship: data.nextOfKinRelationship,
        nextOfKinAddress: data.nextOfKinAddress,
        nextOfKinPhone: data.nextOfKinPhone,
        
        // Document Uploads
        nationalIdCard: data.nationalIdCard || '',
        utilityBill: data.utilityBill || '',
        cacRegistration: data.cacRegistration,
        otherDocuments: data.otherDocuments || '',
        
        // Agreement
        agreedToTerms: data.agreedToTerms,
        agreedToPrivacy: data.agreedToPrivacy,
        
        // Status
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // TODO: Send confirmation email to partner
    // TODO: Send notification email to admin team

    return NextResponse.json({ 
      message: 'Partner registration submitted successfully',
      registrationId: registration.id
    }, { status: 201 })

  } catch (error: any) {
    console.error('Partner registration error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A partner with this information already exists' 
      }, { status: 409 })
    }
    
    // Return more specific error for debugging
    return NextResponse.json({ 
      error: 'Failed to submit registration. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    if (!email) {
      return NextResponse.json({ 
        error: 'Email parameter is required' 
      }, { status: 400 })
    }

    const registration = await prisma.partnerRegistration.findFirst({
      where: { email },
      select: {
        id: true,
        companyName: true,
        ownerName: true,
        email: true,
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

    return NextResponse.json({ registration }, { status: 200 })

  } catch (error: any) {
    console.error('Partner registration lookup error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to lookup registration' 
    }, { status: 500 })
  }
}