import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile information
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        primaryPhone: true,
        cellPhone: true,
        homePhone: true,
        workPhone: true,
        homeAddress: true,
        officeAddress: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        // Legacy fields for backward compatibility
        phone: true,
        address: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      company,
      primaryPhone,
      cellPhone,
      homePhone,
      workPhone,
      homeAddress,
      officeAddress,
      city,
      state,
      country,
      postalCode
    } = body

    // Validate that at least one phone number is provided if any phone number is being updated
    const phoneNumbers = [primaryPhone, cellPhone, homePhone, workPhone].filter(Boolean)
    if (phoneNumbers.length > 0 && !primaryPhone) {
      return NextResponse.json({ 
        error: 'A primary phone number must be specified when updating phone numbers' 
      }, { status: 400 })
    }

    // Prepare update data - only include fields that are being updated
    const updateData: any = {}
    
    if (company !== undefined) updateData.company = company
    if (primaryPhone !== undefined) updateData.primaryPhone = primaryPhone
    if (cellPhone !== undefined) updateData.cellPhone = cellPhone
    if (homePhone !== undefined) updateData.homePhone = homePhone
    if (workPhone !== undefined) updateData.workPhone = workPhone
    if (homeAddress !== undefined) updateData.homeAddress = homeAddress
    if (officeAddress !== undefined) updateData.officeAddress = officeAddress
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (country !== undefined) updateData.country = country
    if (postalCode !== undefined) updateData.postalCode = postalCode

    // Update legacy fields for backward compatibility
    if (primaryPhone !== undefined) updateData.phone = primaryPhone
    if (homeAddress !== undefined || officeAddress !== undefined) {
      updateData.address = homeAddress || officeAddress || null
    }

    updateData.updatedAt = new Date()

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        primaryPhone: true,
        cellPhone: true,
        homePhone: true,
        workPhone: true,
        homeAddress: true,
        officeAddress: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        emailVerified: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ 
      user: updatedUser, 
      message: 'Profile updated successfully' 
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}