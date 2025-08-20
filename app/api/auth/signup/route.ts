import { NextRequest, NextResponse } from 'next/server'

// Temporarily disable database imports for deployment
// import bcrypt from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password, company, phone } = body

    // Temporary response for deployment - database not connected yet
    return NextResponse.json(
      {
        message: 'Signup functionality will be available once database is connected. Please check back soon!',
        status: 'coming_soon'
      },
      { status: 200 }
    )

    // Original code will be re-enabled once database is connected:
    /*
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        company,
        phone,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
    */
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}