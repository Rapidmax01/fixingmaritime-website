import { NextRequest, NextResponse } from 'next/server'
import { getVerificationToken, markEmailAsVerified, deleteVerificationToken } from '@/lib/temp-email-store'

import prisma from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      // Use temporary store for demo mode
      const verification = getVerificationToken(token)
      
      if (!verification) {
        return NextResponse.json(
          { message: 'Invalid or expired verification token' },
          { status: 400 }
        )
      }
      
      // Mark email as verified
      markEmailAsVerified(verification.email)
      deleteVerificationToken(token)
      
      return NextResponse.json(
        { 
          message: 'Email verified successfully! You can now log in. (Demo mode)',
          verified: true 
        },
        { status: 200 }
      )
    }

    // Database mode - find and update the user with verification token
    const user = await prisma.user.findFirst({
      where: { 
        emailVerifyToken: token,
        emailVerifyExpires: {
          gte: new Date() // Token must not be expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null
      }
    })

    console.log('Email verified for user:', user.email)

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now log in to your account.',
        verified: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}

// GET endpoint for URL-based verification (when user clicks email link)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      // Use temporary store for demo mode
      const verification = getVerificationToken(token)
      
      if (!verification) {
        return NextResponse.json(
          { message: 'Invalid or expired verification token' },
          { status: 400 }
        )
      }
      
      // Mark email as verified
      markEmailAsVerified(verification.email)
      deleteVerificationToken(token)
      
      return NextResponse.json(
        { 
          message: 'Email verified successfully! You can now log in. (Demo mode)',
          verified: true 
        },
        { status: 200 }
      )
    }

    // Database mode - find and update the user with verification token
    const user = await prisma.user.findFirst({
      where: { 
        emailVerifyToken: token,
        emailVerifyExpires: {
          gte: new Date() // Token must not be expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null
      }
    })

    console.log('Email verified for user:', user.email)

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now log in to your account.',
        verified: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}