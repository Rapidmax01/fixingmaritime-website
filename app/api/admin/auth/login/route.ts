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

    // In development mode, prefer demo login if using demo credentials
    if (process.env.NODE_ENV === 'development' && email === 'admin@fixingmaritime.com' && password === 'admin123') {
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
        { message: 'Login successful (Demo Mode)', user: demoUser },
        { status: 200 }
      )

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60,
      })

      return response
    }

    // Try to authenticate with database if available
    if (prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (user && user.password) {
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

          if (isPasswordValid) {
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
          }
        }

        // If we get here, credentials were invalid
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )

      } catch (dbError: any) {
        console.error('Database query error:', dbError)
        // Database query failed, fall through to demo mode
      }
    }

    // Demo mode fallback (when database is unavailable or query failed)
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
    }

    // Neither real credentials nor demo credentials worked
    return NextResponse.json(
      { 
        message: prisma 
          ? 'Invalid credentials' 
          : 'Database unavailable. Use demo credentials: admin@fixingmaritime.com / admin123' 
      },
      { status: 401 }
    )

  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}