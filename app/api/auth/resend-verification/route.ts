import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { sendEmail, generateVerificationEmail } from '@/lib/email'

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
      return NextResponse.json(
        { message: 'Verification email sent successfully (Demo mode)' },
        { status: 200 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    }) as any

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const emailVerifyToken = crypto.randomBytes(32).toString('hex')
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with new token (commented out for demo)
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     emailVerifyToken,
    //     emailVerifyExpires,
    //   }
    // })

    // Generate verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/verify-email?token=${emailVerifyToken}`

    // Generate email content
    const emailContent = generateVerificationEmail(user.name || email, verificationUrl)

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Fixing Maritime',
        html: emailContent.html,
        text: emailContent.text,
      })

      return NextResponse.json(
        { message: 'Verification email sent successfully' },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      return NextResponse.json(
        { message: 'Failed to send verification email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}