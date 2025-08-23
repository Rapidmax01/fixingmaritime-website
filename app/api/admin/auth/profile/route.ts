import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

// Simple Prisma client for this endpoint
const prisma = process.env.DATABASE_URL ? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}) : null

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        error: 'Database not available. Please check your database connection.' 
      }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile information with safe field selection
    let user
    try {
      // Try with enhanced fields first
      user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          role: true,
          // Legacy fields (always available)
          phone: true,
          address: true,
          city: true,
          country: true,
          // Enhanced fields (may not exist yet)
          primaryPhone: true,
          cellPhone: true,
          homePhone: true,
          workPhone: true,
          homeAddress: true,
          officeAddress: true,
          state: true,
          postalCode: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        }
      })
    } catch (enhancedError) {
      console.log('Enhanced fields not available, falling back to basic fields:', enhancedError.message)
      
      // Fallback to basic fields only
      user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          role: true,
          phone: true,
          address: true,
          city: true,
          country: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      // Add null values for enhanced fields to maintain compatibility
      if (user) {
        user = {
          ...user,
          primaryPhone: null,
          cellPhone: null,
          homePhone: null,
          workPhone: null,
          homeAddress: null,
          officeAddress: null,
          state: null,
          postalCode: null
        }
      }
    }

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
      return NextResponse.json({ 
        error: 'Database not available. Please check your database connection.' 
      }, { status: 503 })
    }

    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      company,
      // Phone numbers (enhanced fields)
      primaryPhone,
      cellPhone,
      homePhone,
      workPhone,
      // Address fields (enhanced fields)
      homeAddress,
      officeAddress,
      city,
      state,
      country,
      postalCode,
      // Legacy fields for backward compatibility
      phone,
      address
    } = body

    // Prepare update data - only include fields that are being updated
    const updateData: any = {}
    
    if (company !== undefined) updateData.company = company
    
    // Shared fields (always available)
    if (city !== undefined) updateData.city = city
    if (country !== undefined) updateData.country = country
    
    // Legacy fields for backward compatibility (always available)
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    
    // Enhanced fields (try to update if they exist)
    if (primaryPhone !== undefined) updateData.primaryPhone = primaryPhone
    if (cellPhone !== undefined) updateData.cellPhone = cellPhone
    if (homePhone !== undefined) updateData.homePhone = homePhone
    if (workPhone !== undefined) updateData.workPhone = workPhone
    if (homeAddress !== undefined) updateData.homeAddress = homeAddress
    if (officeAddress !== undefined) updateData.officeAddress = officeAddress
    if (state !== undefined) updateData.state = state
    if (postalCode !== undefined) updateData.postalCode = postalCode

    updateData.updatedAt = new Date()

    // Try to update with enhanced fields, fall back to basic fields if needed
    let updatedUser
    try {
      updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          role: true,
          // Legacy fields
          phone: true,
          address: true,
          city: true,
          country: true,
          // Enhanced fields
          primaryPhone: true,
          cellPhone: true,
          homePhone: true,
          workPhone: true,
          homeAddress: true,
          officeAddress: true,
          state: true,
          postalCode: true,
          emailVerified: true,
          updatedAt: true
        }
      })
    } catch (enhancedUpdateError) {
      console.log('Enhanced update failed, trying basic fields only:', enhancedUpdateError.message)
      
      // Filter out enhanced fields and try again
      const basicUpdateData = {
        company: updateData.company,
        phone: updateData.phone,
        address: updateData.address,
        city: updateData.city,
        country: updateData.country,
        updatedAt: updateData.updatedAt
      }
      
      // Remove undefined values
      Object.keys(basicUpdateData).forEach(key => 
        basicUpdateData[key] === undefined && delete basicUpdateData[key]
      )
      
      updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: basicUpdateData,
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          role: true,
          phone: true,
          address: true,
          city: true,
          country: true,
          emailVerified: true,
          updatedAt: true
        }
      })
      
      // Add null values for enhanced fields to maintain compatibility
      updatedUser = {
        ...updatedUser,
        primaryPhone: null,
        cellPhone: null,
        homePhone: null,
        workPhone: null,
        homeAddress: null,
        officeAddress: null,
        state: null,
        postalCode: null
      }
    }

    return NextResponse.json({ 
      user: updatedUser, 
      message: 'Profile updated successfully' 
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}