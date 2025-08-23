import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

const prisma = process.env.DATABASE_URL ? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}) : null

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ 
        error: 'Database not available' 
      }, { status: 503 })
    }

    // Check if user is authenticated
    const currentUser = getAdminFromRequest(request)
    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    // Get all users for debugging
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        password: true // Just to check if password exists
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to include hasPassword boolean instead of actual password
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      hasPassword: !!user.password
    }))

    return NextResponse.json({ 
      users: transformedUsers,
      total: users.length,
      adminCount: users.filter(u => ['admin', 'super_admin'].includes(u.role)).length
    })

  } catch (error: any) {
    console.error('Error fetching users for debug:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch users' 
    }, { status: 500 })
  }
}