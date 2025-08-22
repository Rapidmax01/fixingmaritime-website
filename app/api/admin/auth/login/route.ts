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

    // Demo mode for when database is not available
    if (!prisma) {
      // Check for demo admin credentials
      if (email === 'admin@fixingmaritime.com' && password === 'admin123') {
        const demoUser = {
          id: 'demo-admin',
          email: 'admin@fixingmaritime.com',
          name: 'Demo Admin',
          role: 'super_admin'
        }

        // Generate JWT token
        const token = jwt.sign(
          demoUser,
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '8h' }
        )

        const response = NextResponse.json(
          {
            message: 'Login successful (Demo Mode)',
            user: demoUser
          },
          { status: 200 }
        )

        response.cookies.set('admin-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 8 * 60 * 60,
        })

        return response
      } else {
        return NextResponse.json(
          { message: 'Invalid credentials. In demo mode, use admin@fixingmaritime.com / admin123' },
          { status: 401 }
        )
      }
    }

    // Find user and check if they are an admin
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email }
      })
    } catch (dbError: any) {
      console.error('Database query error:', dbError)
      // Fall back to demo mode if database fails
      if (email === 'admin@fixingmaritime.com' && password === 'admin123') {
        const demoUser = {
          id: 'demo-admin',
          email: 'admin@fixingmaritime.com',
          name: 'Demo Admin',
          role: 'super_admin'
        }

        const token = jwt.sign(
          demoUser,
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '8h' }
        )

        const response = NextResponse.json(
          {
            message: 'Login successful (Demo Mode - Database temporarily unavailable)',
            user: demoUser
          },
          { status: 200 }
        )

        response.cookies.set('admin-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 8 * 60 * 60,
        })

        return response
      }
      
      return NextResponse.json(
        { message: 'Database connection error. In demo mode, use admin@fixingmaritime.com / admin123' },
        { status: 503 }
      )
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user has admin or super_admin role
    if (user.role !== 'admin' && user.role !== 'super_admin') {
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