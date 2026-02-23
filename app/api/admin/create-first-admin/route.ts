import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/database'

// This endpoint creates the first admin user
// Only works if no admin exists in the system
export async function POST(req: NextRequest) {
  try {
    const { email, secretKey } = await req.json()

    const ADMIN_CREATION_SECRET = process.env.ADMIN_CREATION_SECRET
    if (!ADMIN_CREATION_SECRET) {
      return NextResponse.json(
        { message: 'Admin creation not configured' },
        { status: 503 }
      )
    }
    
    if (secretKey !== ADMIN_CREATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret key' },
        { status: 403 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin already exists. Contact existing admin for access.' },
        { status: 400 }
      )
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found. Please create an account first.' },
        { status: 404 }
      )
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { message: 'Please verify your email before becoming an admin.' },
        { status: 400 }
      )
    }

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    })

    console.log('First admin created:', updatedUser.email)

    return NextResponse.json({
      message: 'Admin created successfully!',
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    })

  } catch (error: any) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { message: 'Failed to create admin' },
      { status: 500 }
    )
  }
}