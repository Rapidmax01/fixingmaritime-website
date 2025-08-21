import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { sendEmail, generateVerificationEmail } from '@/lib/email'
import { storeVerificationToken } from '@/lib/temp-email-store'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

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

    // Check if database is configured
    if (!prisma) {
      console.log('Database not configured - Using demo mode with temp storage')
      
      // Generate verification token
      const emailVerifyToken = crypto.randomBytes(32).toString('hex')
      
      // Store in temporary memory
      storeVerificationToken(email, emailVerifyToken)
      
      // Generate verification URL
      const verificationUrl = `${process.env.NEXTAUTH_URL || 'https://www.fixingmaritime.com'}/verify-email?token=${emailVerifyToken}`
      
      // Generate email content
      const emailContent = generateVerificationEmail(`${firstName} ${lastName}`, verificationUrl)
      
      // Send verification email
      const emailSent = await sendEmail({
        to: email,
        subject: 'Welcome to Fixing Maritime - Verify Your Email',
        html: emailContent.html,
        text: emailContent.text,
      })
      
      return NextResponse.json(
        {
          message: emailSent 
            ? 'Account created! Please check your email to verify your account. (Demo mode)'
            : 'Account created! Click the verification link shown in console. (Demo mode)',
          user: {
            id: 'demo-' + Date.now(),
            email,
            name: `${firstName} ${lastName}`,
            company: company || '',
            phone: phone || '',
          },
          requiresEmailVerification: true,
          demoVerificationUrl: !emailSent ? verificationUrl : undefined
        },
        { status: 201 }
      )
    }

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

    // Generate email verification token
    const emailVerifyToken = crypto.randomBytes(32).toString('hex')
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user with email verification fields
    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        company,
        phone,
        emailVerifyToken,
        emailVerifyExpires,
        emailVerified: false,
      },
    })

    // Generate verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'https://www.fixingmaritime.com'}/verify-email?token=${emailVerifyToken}`

    // Generate email content
    const emailContent = generateVerificationEmail(user.name || email, verificationUrl)

    // Send verification email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Welcome to Fixing Maritime - Verify Your Email',
      html: emailContent.html,
      text: emailContent.text,
    })

    if (!emailSent) {
      console.log('Email sending failed but user was created')
    }

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: emailSent 
          ? 'Account created successfully! Please check your email to verify your account.'
          : 'Account created successfully! You can now log in.',
        user: userWithoutPassword,
        requiresEmailVerification: emailSent
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Provide more specific error messages in development
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { message: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }
    
    // Log the full error for debugging
    console.error('Full error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    })
    
    return NextResponse.json(
      { message: 'Unable to create account. Please try again.' },
      { status: 500 }
    )
  }
}