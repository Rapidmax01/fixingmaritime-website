import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

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

    // Skip authentication check for debugging purposes - since demo account is working
    // In production, you might want to add authentication back

    // Get all users for debugging (using app_users table with explicit casting)
    const users: any[] = await prisma.$queryRaw`
      SELECT 
        id::text as id,
        email, 
        name, 
        role, 
        "emailVerified",
        "createdAt",
        (password IS NOT NULL) as "hasPassword"
      FROM app_users 
      ORDER BY "createdAt" DESC
    `

    // Transform the raw query results
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      hasPassword: user.hasPassword
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