import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    // Find user and check if they are an admin
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { message: 'Please verify your email address first' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token for admin session
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '8h' }
    )

    // Set httpOnly cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
      { status: 200 }
    )

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 hours
    })

    return response

  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}