import { NextRequest, NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// import crypto from 'crypto'
// import { sendEmail, generateVerificationEmail } from '@/lib/email'

// const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password, company, phone } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // For demo mode - always return success without database operations
    console.log('Demo mode: Creating account for:', email)
    
    return NextResponse.json(
      {
        message: 'Account created successfully! You can now log in.',
        user: {
          id: 'demo-' + Date.now(),
          email,
          name: `${firstName} ${lastName}`,
          company: company || '',
          phone: phone || '',
        },
        requiresEmailVerification: false
      },
      { status: 201 }
    )

    // This code is unreachable but kept for when database is configured
    // Rest of database operations would go here...
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}