import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}) : null

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        error: 'Database not available' 
      }, { status: 503 })
    }

    // Check if user is authenticated and has admin privileges
    const currentUser = await getAdminFromRequest(request)
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Super admin privileges required' 
      }, { status: 403 })
    }

    const body = await request.json()
    const { email, name, password, company, role, emailVerified } = body

    if (!email || !name || !password) {
      return NextResponse.json({ 
        error: 'Email, name, and password are required' 
      }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new admin user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        company: company || null,
        role: role || 'admin',
        emailVerified: emailVerified !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    })

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      user: newUser
    })

  } catch (error: any) {
    console.error('Error creating admin user:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 })
    }

    return NextResponse.json({ 
      error: 'Failed to create admin user' 
    }, { status: 500 })
  }
}