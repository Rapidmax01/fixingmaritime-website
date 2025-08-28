import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminFromRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const admin = await getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      )
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        company: true,
        phone: true,
        city: true,
        country: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      users,
      total: users.length
    })

  } catch (error: any) {
    console.error('List users error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}