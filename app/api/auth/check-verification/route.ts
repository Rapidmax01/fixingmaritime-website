import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { isEmailVerified } from '@/lib/temp-email-store'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      // Use temporary store for demo mode
      const verified = isEmailVerified(email)
      
      return NextResponse.json(
        { 
          emailVerified: verified,
          userExists: true 
        },
        { status: 200 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    }) as any

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', emailVerified: false },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        emailVerified: user.emailVerified || false,
        userExists: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Check verification error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}